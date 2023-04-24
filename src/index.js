const express = require('express');
const { json, urlencoded } = express;
const { connectToDatabase } = require('./config/mongoose');
const passport = require('passport');
const logger = require('./helpers/logger');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
require('./auth/auth.service')(passport);

app.use('/api', require('./routes/routes'));

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ status: true, message: 'Welcome to SPEFIND index page' });
});

connectToDatabase();

app.listen(PORT, () => {
  logger.info(`Server now live at port ${PORT}`);
});
