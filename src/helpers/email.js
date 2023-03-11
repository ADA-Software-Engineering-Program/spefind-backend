require('dotenv').config();
const { ELASTIC_API_KEY, ELASTIC_USERNAME } = require('../config/keys');
const elasticemail = require('elasticemail');

const logger = require('./logger');
var client = elasticemail.createClient({
  username: ELASTIC_USERNAME,
  apiKey: ELASTIC_API_KEY,
});

const Mailgen = require('mailgen');
var mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'The MeetUp Team',
    link: 'https://mailgen.js/',
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

const sendOTP = async (userMail, userPin) => {
  const email_sender = 'info@davayte.net';
  const subject_matter = 'Account Verification';
  const email = {
    body: {
      greeting: `Heyy There`,
      intro: [``],

      action: {
        instructions: `Your OTP is ${userPin}. Thanks for registering.`,
        button: {
          color: '', // Optional action button color
          text: '',
          link: '',
        },
      },
      outro: '',
    },
  };
  const msg = {
    // Change to your recipient
    from: email_sender,
    from_name: 'MeetUp Support',
    to: userMail,
    subject: subject_matter,
    body_text: mailGenerator.generatePlaintext(email),
    // html: mailGenerator.generate(email),
  };
  client.mailer.send(msg, function(err, result) {
    if (err) {
      return console.error(err);
    }

    // console.log(result);
  });
};

const resendOTPMail = async (userMail, userPin) => {
  console.log(userMail, userPin);
  const email_sender = 'info@davayte.net';
  const subject_matter = 'OTP Resend';
  const email = {
    body: {
      greeting: `Heyy There`,
      intro: [``],

      action: {
        instructions: `You are receiving this mail because you requested an OTP resend. Your OTP is ${userPin}.`,
        button: {
          color: '', // Optional action button color
          text: '',
          link: '',
        },
      },
      outro: '',
    },
  };
  const msg = {
    // Change to your recipient
    from: email_sender,
    from_name: 'MeetUp Support',
    to: userMail,
    subject: subject_matter,
    body_text: mailGenerator.generatePlaintext(email),
    // html: mailGenerator.generate(email),
  };
  client.mailer.send(msg, function(err, result) {
    if (err) {
      return console.error(err);
    }

    console.log(result);
  });
};

module.exports = { sendOTP, resendOTPMail };
