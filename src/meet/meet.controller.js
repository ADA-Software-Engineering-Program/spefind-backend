const { RtcRole, RtcTokenBuilder } = require('agora-access-token');
const {
  AGORA_APP_ID,
  AGORA_CERTIFICATE,
  AGORA_CUSTOMER_KEY,
  AGORA_CUSTOMER_SECRET,
} = require('../config/keys');
const axios = require('axios');

const plainCredential = `${AGORA_CUSTOMER_KEY}:${AGORA_CUSTOMER_SECRET}`;

encodedCredential = Buffer.from(plainCredential).toString('base64');

authorizationField = `Basic ${encodedCredential}`;

const nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header = ('Pragma', 'no-cache');
  next();
};

const generateRTCToken = (req, res) => {
  let token;

  token = RtcTokenBuilder.buildTokenWithAccount(
    AGORA_APP_ID,
    AGORA_CERTIFICATE,
    req.params.channel,
    req.params.uid,
    req.params.role,
    3600
  );
  console.log(token);
  res
    .status(200)
    .json({ status: 'success', message: 'Token server generated...', token });
};

const createProject = async (req, res) => {
  let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
  const requestBody = {
    name: `corddit-${code}`,
    enable_sign_key: true,
  };

  const requestHeaders = {
    Authorization: `Basic ${encodedCredential}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.post(
    'https://api.agora.io/dev/v1/project',
    requestBody,
    { headers: requestHeaders }
  );
  console.log(response);
  res.status(200).json({
    status: 'success',
    message: 'Project created...',
    data: response.data.project,
  });
};

module.exports = { nocache, createProject, generateRTCToken };
