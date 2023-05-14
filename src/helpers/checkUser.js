const User = require('../auth/user.model');
const checkEmail = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({
      status: 'error',
      message: 'Oops! A user with this email already exists!',
    });
    return;
  } else {
    next();
  }
};

const checkUserName = async (req, res, next) => {
  let userName;
  if (req.body.username) userName = req.body.username.toLowerCase();
  let user = await User.findOne({ username: userName });
  if (user) {
    res.status(400).json({
      status: 'error',
      message: 'Oops! A user with this userName already exists!',
    });
    return;
  }
  next();
};

module.exports = { checkEmail, checkUserName };
