const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('./user.model');

module.exports = (passport) => {
  passport.use(
    'login',
    new localStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const transformedMail = email.toLowerCase();
          const user = await User.findOne({ email: transformedMail });

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const validate = await user.isPasswordMatch(password);

          if (!validate) {
            return done(null, false, {
              message: 'Incorrect password inputted...',
            });
          }
          const userData = JSON.parse(JSON.stringify(user));

          return done(null, userData, { message: 'Login Successful' });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
