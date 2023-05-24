const catchAsync = require('express-async-handler');
const tokenService = require('./token.service');
const passport = require('passport');
const ApiError = require('../helpers/error');
const authService = require('../profile/profile.service');

// const { sendOTP } = require('../helpers/email');

const register = catchAsync(async (req, res) => {
  let data = req.user;
  const authToken = await tokenService.generateAuthTokens(data);
  const token = authToken.access.token;
  res.status(201).json({
    status: true,
    message: 'Account Successfully Created!',
    data,
    token,
  });
});
const registerAdmin = catchAsync(async (req, res) => {
  let data = req.user;
  const authToken = await tokenService.generateAuthTokens(data);
  const token = authToken.access.token;
  res.status(201).json({
    status: true,
    message: 'Admin Account Successfully Created!',
    data,
    token,
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
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          name: user.name,
          userRole: user.userRole,
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
  await authService.updatePassword(
    req.user.email,
    req.body.oldPassword,
    req.body.newPassword
  );
  res
    .status(201)
    .json({ status: 'success', message: 'Password Successfully Updated...' });
});

module.exports = {
  register,
  login,
  registerAdmin,
  changePassword,
  updatePassword,
};
