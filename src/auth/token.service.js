const moment = require('moment');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const bcrypt = require('bcryptjs');
const User = require('./user.model');
const ApiError = require('../helpers/error');
const { forgotPasswordEmail } = require('../helpers/email');
const JWT_STRING = JWT_SECRET;
const generateToken = (user, expires) => {
  const payload = {
    sub: user.id,
    user,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, JWT_STRING);
};

const generateAuthTokens = (user, newUser = false) => {
  const accessTokenExpires = moment().add(60, 'minutes');
  const accessToken = generateToken(user, accessTokenExpires);
  const returnTokens = {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
  return returnTokens;
};

const expireUserToken = async (user, newUser = false) => {
  const accessTokenExpires = moment().add(0, 'seconds');
  const accessToken = generateToken(user, accessTokenExpires);
  const returnTokens = {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
  return returnTokens;
};

const inputMail = async (email) => {
  let checkUser = await User.findOne({ email });
  console.log(checkUser);

  if (!checkUser) {
    throw new ApiError(400, 'This user does not exist...');
  }
  const token = await generateAuthTokens(checkUser);
  console.log(token);
  const emailLink = `https://spefind-backend.onrender.com/api/auth/verify?token=${checkUser._id}`;
  forgotPasswordEmail(email, emailLink);
  return;
};

const updatePassword = async (email, password) => {
  try {
    let hashedPassword = await bcrypt.hash(password, 10);
    return await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    throw new ApiError(400, 'Unable to update password...');
  }
};

module.exports = {
  updatePassword,
  generateAuthTokens,
  inputMail,
  generateToken,
  expireUserToken,
};
