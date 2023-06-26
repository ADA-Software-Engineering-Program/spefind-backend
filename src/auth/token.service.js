const moment = require('moment');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const generateToken = (user, expires) => {
  const payload = {
    sub: user.id,
    user,
    // iat: moment().unix(),
    // exp: expires.unix(),
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '14d' });
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

const decodeToken = async (token) => {
    return await jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {  return err }
        return decoded;
    });
};

module.exports = { generateAuthTokens, generateToken, expireUserToken, decodeToken };
