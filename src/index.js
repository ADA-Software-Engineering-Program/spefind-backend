const express = require('express');

const { json, urlencoded } = express;
const { PORT } = require('./config/keys');
const { connectToDatabase } = require('./config/mongoose');
const logger = require('./helpers/logger');
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

app.listen(PORT, () => {
  logger.info(`Server is now live at port ${PORT}`);
});
