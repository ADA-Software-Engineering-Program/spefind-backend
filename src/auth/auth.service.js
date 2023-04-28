const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('./user.model');

module.exports = (passport) => {
  passport.use(
    'speaker',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          let data = {};
          const transformedMail = email.toLowerCase();
          data.email = transformedMail;
          const hashedPassword = await bcrypt.hash(password, 10);
          data.password = hashedPassword;
          data.userRole = 'speaker';
          const user = await User.create(data);
          let createdObject = {};
          createdObject.email = user.email;
          data.firstName = req.body.firstName;
          data.lastName = req.body.lastName;
          createdObject.userRole = user.userRole;
          createdObject.createdAt = user.createdAt;
          createdObject.updatedAt = user.updatedAt;

          return done(null, createdObject);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  passport.use(
    'organizer',
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          let data = {};
          const transformedMail = email.toLowerCase();
          data.email = transformedMail;
          const hashedPassword = await bcrypt.hash(password, 10);
          data.password = hashedPassword;
          data.firstName = req.body.firstName;
          data.lastName = req.body.lastName;
          data.userRole = 'organizer';

          const user = await User.create(data);
          let createdObject = {};
          createdObject.email = user.email;
          createdObject.firstName = user.firstName;
          createdObject.lastName = user.lastName;
          createdObject.userRole = user.userRole;
          createdObject.createdAt = user.createdAt;
          createdObject.updatedAt = user.updatedAt;
          return done(null, createdObject);
        } catch (err) {
          done(err);
        }
      }
    )
  );

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
