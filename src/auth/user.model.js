const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getEnumsArray, USER_ROLE } = require('../helpers/enums');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    userPin: {
      type: Number,
    },
    userRole: {
      type: String,
      enums: [getEnumsArray(USER_ROLE)],
    },
    photo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordMatch = async function(password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
