const catchAsync = require('express-async-handler');
const tokenService = require('./token.service');
const cron = require('node-cron');
const passport = require('passport');
const ApiError = require('../helpers/error');
const authService = require('./auth.services');
const { sendOTP } = require('../helpers/email');
// const cloudinary = require('../helpers/cloudinary');
// const { sendOTP } = require('../helpers/email');

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

const forgotPassword = async (req, res) => {
  const { email, userPin } = await authService.getUserByMail(req.body.email);
  let data = { email, userPin };
  const token = await tokenService.generateAuthTokens(data);
  sendOTP(email, userPin);
  res.status(200).json({
    status: true,
    message: 'You have just been sent an OTP to your email... Please confirm',
    token: token.access.token,
  });
};

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

const updatePassword = catchAsync(async (req, res) => {
  console.log(req.user);
  await authService.updatePassword(
    req.user.email,
    req.body.oldPassword,
    req.body.newPassword
  );
  res
    .status(201)
    .json({ status: 'success', message: 'Password Successfully Updated...' });
});

const editProfile = catchAsync(async (req, res) => {
  if (req.body.password) {
    throw new ApiError(400, "You can't update your password Here!");
  }
  const updatedbody = req.body;

  if (req.file) {
    const avatar = await cloudinary.uploader.upload(req.file.path);
    updatedbody.photo = avatar.secure_url;
  }

  const user = await authService.editUserProfile(req.user._id, updatedbody);
  res.status(200).json({
    status: 'success',
    message: 'Yeaa! Profile update successful!',
    user,
  });
});

module.exports = {
  register,
  nameInput,
  login,
  editProfile,
  forgotPassword,
  confirmOTP,
  passwordInput,
  resendOTP,
  changePassword,
  updatePassword,
};
