const catchAsync = require('express-async-handler');
const tokenService = require('./token.service');
const cron = require('node-cron');
const passport = require('passport');
const ApiError = require('../helpers/error').default;
const authService = require('./auth.services');
const { sendOTP, resendOTPMail } = require('../helpers/email');
const cloudinary = require('../helpers/cloudinary');

const register = catchAsync(async (req, res) => {
    const data = await authService.registerUser(req.body);
    const authToken = await tokenService.generateAuthTokens(data);
    const token = authToken.access.token;
    sendOTP(data.email, data.userPin);
    res.status(201).json({
        status: true,
        message:
            'Account Creation Initiated! You have also just received an OTP in your mail...',
        data,
        token,
    });
});

const confirmOTP = catchAsync(async (req, res) => {
    if (!req.body.OTP) {
        throw new ApiError(400, 'An OTP is required here...');
    }
    // console.log(req.user);
    // console.log(req.body);
    await authService.confirmOTP(req.user._id, req.body.OTP);
    res.status(200).json({
        status: true,
        message: 'Yeaa! OTP correctly inputted... Your email is also now verified!',
    });
});

const resendOTP = catchAsync(async (req, res) => {
    const data = await authService.resendOTP(req.user._id);
    resendOTPMail(req.user.email, data);
    res.status(201).json({
        status: true,
        message: 'OTP has just been resent to your mail...',
    });
});

const setupProfile = catchAsync(async (req, res) => {
    let requestBody = req.body;
    if (req.file) {
        const avatar = await cloudinary.uploader.upload(req.file.path);
        requestBody.thumbNail = avatar.secure_url;
    }
    const data = await authService.setProfile(req.user._id, requestBody);
    const token = await tokenService.generateAuthTokens(data);
    res.status(201).json({
        status: 'success',
        message: 'First, Last Name, Username & Password et al. now Updated...',
        data,
        token: token.access.token,
    });
});

const login = catchAsync((req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const err = new ApiError(
                    400,
                    'Ooopss! You have either inputted an incorrect password or an unregistered email...'
                );
                return next(err);
            }
            req.login(user, { session: false }, async (err) => {
                if (err) return next(err);
                const data = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                };
                const token = await tokenService.generateAuthTokens(data);

                res.status(200).json({
                    status: 'success',
                    message: 'Login Successful!',
                    data,
                    token: token.access.token,
                });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

const userBio = async (req, res) => {
    const data = await authService.userBio(req.user._id, req.body);
    res
        .status(200)
        .json({ status: true, message: 'User Bio Now Updated...', data });
};

const forgotPassword = async (req, res) => {
    const { email } = await authService.getUserByMail(req.body.email);
    let data = { email };
    const token = await tokenService.generateAuthTokens(data);

    res.status(200).json({
        status: true,
        message: 'Email confirmed... Please proceed onto reset your password',
        token: token.access.token,
    });
};

const resetPassword = catchAsync(async (req, res) => {
    await authService.changePassword(req.user.email, req.body.password);
    res.status(200).json({
        status: 'success',
        message: 'Password successfully reset...',
    });
});

const changePassword = catchAsync(async (req, res) => {
    if (!req.body.password) {
        throw new ApiError(400, 'Kindly input the new desired password');
    }
    const user = await authService.changePassword(
        req.user.email,
        req.body.password
    );
    res.status(200).json({
        status: true,
        message: 'Password Change Successfully Effected...',
    });
});

const editProfile = catchAsync(async (req, res) => {
    if (req.body.email) {
        throw new ApiError(400, " Oops! You can't update your email Here!");
    }
    if (req.body.password) {
        throw new ApiError(400, "You can't update your password Here!");
    }
    const updatedbody = req.body;

    if (req.file) {
        const avatar = await cloudinary.uploader.upload(req.file.path);
        updatedbody.thumbNail = avatar.secure_url;
    }

    const user = await authService.editUserProfile(req.user._id, updatedbody);
    res.status(200).json({
        status: 'success',
        message: 'Yeaa! Profile update successful!',
        user,
    });
});

const updateField = catchAsync(async (req, res) => {
    const data = await authService.updateField(req.user._id, req.body);
    res.status(200).json({
        status: true,
        message: 'Field of Discipline now updated...',
        data,
    });
});

module.exports = {
    register,
    updateField,
    setupProfile,
    login,
    editProfile,
    forgotPassword,
    confirmOTP,
    userBio,
    resendOTP,
    resetPassword,
    changePassword,
};
