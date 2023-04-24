const catchAsync = require('express-async-handler');
const tokenService = require('./token.service');
const passport = require('passport');
const ApiError = require('../helpers/error');
const authService = require('./auth.service');
// const cloudinary = require('../helpers/cloudinary');

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
          id: user._id,
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

const forgotPassword = async (req, res) => {
  const { email, userPin } = await authService.getUserByMail(req.body.email);
  let data = { email, userPin };
  const token = await tokenService.generateAuthTokens(data);

  res.status(200).json({
    status: true,
    message: 'You have just been sent an OTP to your email... Please confirm',
    token: token.access.token,
  });
};

const confirmOTP = catchAsync(async (req, res) => {
  if (!req.body.OTP) {
    throw new ApiError(400, 'An OTP is required here...');
  }

  const user = await authService.confirmOTP(req.user.userPin, req.body.OTP);
  res
    .status(200)
    .json({ status: true, message: 'Yeaa! OTP correctly inputted...' });
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
  login,
  editProfile,
  registerAdmin,
  forgotPassword,
  confirmOTP,
  changePassword,
  updatePassword,
};
