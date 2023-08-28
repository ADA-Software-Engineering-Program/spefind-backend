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
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    availableTo: {
      type: [String],
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
    coverBanner: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
    },
    pastEvents: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    },
    eventType: {
      type: [String],
      trim: true,
    },
    mainField: {
      type: String,
      trim: true,
    },
    subfield: {
      type: String,
      trim: true,
    },
    career: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    job: {
      title: {
        type: String,
        trim: true,
      },
      yearsOfPractice: {
        type: Number,
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

    language: {
      type: String,
      enum: ['English', 'French', 'others'],
    },

    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    pricing: {
      type: String,
      trim: true,
    },
    isProfileCreated: {
      type: Boolean,
      default: false,
    },
    isVolunteer: {
      type: String,
      default: 'false',
    },
    isVisible: {
      type: String,
      default: 'false',
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
