const express = require('express');
const passport = require('passport');
const { json, urlencoded } = express;
const { PORT } = require('./config/keys');
const { connectToDatabase } = require('./config/mongoose');
const { errorConverter, errorHandler } = require('./helpers/asyncError');
const logger = require('./helpers/logger');
require('./auth/auth.service')(passport);
const app = express();

app.use(json());

app.use(urlencoded({ extended: true }));

app.use('/api/v1/', require('./routes/routes'));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ status: true, message: 'Welcome to MeetUp Server...' });
});

connectToDatabase();

app.use(errorConverter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is now live at port ${PORT}`);
});
