const express = require('express');
const passport = require('passport');
const { json, urlencoded } = express;
const { PORT } = require('./config/keys');
const { connectToDatabase } = require('./config/mongoose');
const { errorConverter, errorHandler } = require('./helpers/asyncError');
const logger = require('./helpers/logger');
const Sentry = require('@sentry/node');
require('./auth/auth.service')(passport);
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
Sentry.init({
  dsn:
    'https://f39ad17add1641d281c453b0bb74c3a0@o4503931293335552.ingest.sentry.io/4503931297136640',
});
app.use(Sentry.Handlers.requestHandler());

app.use('/api/v1/', require('./routes/routes'));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ status: true, message: 'Welcome to MeetUp Server...' });
});

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (
        error.statusCode === 400 ||
        error.statusCode === 500 ||
        error.statusCode === 403 ||
        error.statusCode === 404
      ) {
        return true;
      }
      return false;
    },
  })
);

app.use(errorConverter);

app.use(errorHandler);

connectToDatabase();

app.listen(PORT, () => {
  logger.info(`Server is now live at port ${PORT}`);
});
