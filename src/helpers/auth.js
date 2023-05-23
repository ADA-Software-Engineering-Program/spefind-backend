const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const User = require('../auth/user.model');
const Feed = require('../feed/feed.model');

const userAuthentication = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    res.status(403).json({
      status: 'access denied',
      msg:
        "Oops! Something sure went wrong... You're likely not authenticated!",
    });
    return;
  }
  const bearer = bearerHeader.split(' ');
  const [tops, token] = bearer;
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({
        status: 'access denied',
        msg: 'Oops! Your token might be expired...',
      });
      return;
    } else {
      req.user = decodedToken.user;
      return next();
    }
  });
  // req.token = bearer;
  // console.log(bearer[1]);
};

const verifiedEmailAuthorization = async (req, res, next) => {
  const { isAccountConfirmed } = await User.findById(req.user._id);
  if (!req.user || isAccountConfirmed === false) {
    res.status(403).json({
      status: 'access denied',
      message:
        'Ooppss! Only email verified users are permitted to perform this action...',
    });
    return;
  }
  next();
};

const feedAuthorization = async (req, res, next) => {
  const { author } = await Feed.findById(req.query.feedId);
  if (!req.user || req.user._id != author) {
    res.status(403).json({
      status: 'access forbidden',
      message: 'only author of feed is allowed permission here...',
    });
    return;
  }
  next();
};

const adminAuthorization = async (req, res, next) => {
  if (!req.user || req.user.userRole !== 'admin') {
    res.status(403).json({
      status: 'access denied',
      message:
        'Ooppss! Only admins are permitted to perform this action or view this resource...',
    });
    return;
  }
  next();
};

module.exports = {
  userAuthentication,
  feedAuthorization,
  verifiedEmailAuthorization,
  adminAuthorization,
};
