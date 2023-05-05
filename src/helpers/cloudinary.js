const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const {
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_API_SECRET,
} = require('../config/keys');

// const CLOUD_NAME = process.env.CLOUDINARY_NAME;
// const API_KEY = process.env.CLOUDINARY_KEY;
// const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
module.exports = cloudinary;
