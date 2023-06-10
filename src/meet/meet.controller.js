const { RtcRole, RtcTokenBuilder } = require('agora-access-token');
const { AGORA_APP_ID, AGORA_CERTIFICATE } = require('../config/keys');

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

module.exports = { nocache, generateRTCToken };
