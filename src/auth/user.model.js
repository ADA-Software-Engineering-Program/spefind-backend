const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { getEnumsArray, USER_ROLE } = require('../helpers/enums');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
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
    pastEvents: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    },
    eventType: { type: [{ type: Schema.Types.ObjectId, ref: 'Event-Type' }] },
    field: {
      type: Schema.Types.ObjectId,
      ref: 'Field',
    },
    education: {
      type: String,
      trim: true,
    },
    job: [
      {
        title: {
          type: String,
          trim: true,
        },
        yearsOfPractice: {
          type: String,
          trim: true,
        },
        jobDescription: {
          type: String,
          trim: true,
        },
        position: {
          type: String,
          trim: true,
        },
      },
    ],
    language: {
      type: String,
      enum: ['English', 'French', 'others'],
    },

    state: {
      type: Schema.Types.ObjectId,
      ref: 'State',
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
