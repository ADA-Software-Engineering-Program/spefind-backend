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
    username: {
      type: String,
      trim: true,
    },
    userPin: {
      type: Number,
    },
    photo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    selfDescription: {
      type: String,
      trim: true,
    },

    discipline: {
      type: Schema.Types.ObjectId,
      ref: 'Field',
    },
    areaOfSpecialty: {
      type: String,
      trim: true,
    },
    areasOfInterest: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Field' }],
      trim: true,
    },

    isAccountConfirmed: {
      type: Boolean,
      trim: true,
      default: false,
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
