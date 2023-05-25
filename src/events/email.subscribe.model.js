const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailSubscribeSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
});

const EmailSubscribe = mongoose.model('Email', emailSubscribeSchema);

module.exports = EmailSubscribe;
