require('dotenv').config();
module.exports = {
  //   NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ELASTIC_API_KEY: process.env.ELASTIC_API_KEY,
  ELASTIC_USERNAME: process.env.ELASTIC_USERNAME,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  AGORA_APP_ID: process.env.AGORA_APP_ID,
  AGORA_CERTIFICATE: process.env.AGORA_CERTIFICATE,
  AGORA_CUSTOMER_KEY: process.env.AGORA_CUSTOMER_KEY,
  AGORA_CUSTOMER_SECRET: process.env.AGORA_CUSTOMER_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};
