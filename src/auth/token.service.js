const moment = require('moment');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const generateToken = (user, expires) => {
  const payload = {
    sub: user.id,
    user,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, JWT_SECRET);
};

const generateAuthTokens = async (user, newUser = false) => {
  const accessTokenExpires = moment().add(14, 'days');
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

module.exports = { generateAuthTokens, generateToken, expireUserToken };
