const catchAsync = require('express-async-handler');
const tokenService = require('./token.service');
const cron = require('node-cron');
const passport = require('passport');
const ApiError = require('../helpers/error');
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
  await authService.confirmOTP(req.user._id, req.body.OTP);
  res.status(200).json({
    status: true,
    message: 'Yeaa! OTP correctly inputted... Your email is also now verified!',
  });
});

const resendOTP = catchAsync(async (req, res) => {
  const data = await authService.resendOTP(req.user._id);
  console.log(data);
  resendOTPMail(req.user.email, data);
  res.status(201).json({
    status: true,
    message: 'OTP has just been resent to your mail...',
  });
});

const nameInput = catchAsync(async (req, res) => {
  const data = await authService.nameInput(req.user._id, req.body);
  res.status(201).json({
    status: 'success',
    message: 'First, Last Name & Username now Updated...',
    data,
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
        console.log(user);
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

const passwordInput = catchAsync(async (req, res) => {
  const data = await authService.inputPassword(req.user._id, req.body);
  res
    .status(201)
    .json({ status: 'success', message: 'Password input Successful...' });
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

const uploadProfilePhoto = catchAsync(async (req, res) => {
  if (req.body.password || req.body.username || req.body.firstName) {
    throw new ApiError(400, "You can't upload any other user info here...");
  }
  const uploadedImage = {};

  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    uploadedImage.photo = avatar.secure_url;
  }

  const user = await authService.uploadPhoto(req.user._id, uploadedImage);
  res.status(200).json({
    status: 'success',
    message: 'Yeaa! Display Photo update successful!',
    user,
  });
});

const updateField = async (req, res) => {
  const data = await authService.updateField(req.user._id, req.body);
  res.status(200).json({
    status: true,
    message: 'Field of Discipline now updated...',
    data,
  });
};

module.exports = {
  register,
  updateField,
  nameInput,
  login,
  uploadProfilePhoto,
  forgotPassword,
  confirmOTP,
  userBio,
  passwordInput,
  resendOTP,
  resetPassword,
  changePassword,
};
