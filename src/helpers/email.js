const { ELASTIC_API_KEY, ELASTIC_USERNAME } = require('../config/keys');

const elasticemail = require('elasticemail');

var client = elasticemail.createClient({
  username: ELASTIC_USERNAME,
  apiKey: ELASTIC_API_KEY,
});

const Mailgen = require('mailgen');
var mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Spefind Support Team',
    link: 'https://mailgen.js/',
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

const forgotPasswordEmail = async (userMail, link) => {
  const email_sender = 'info@davayte.com';
  const subject_matter = 'Spefind Account Verification';
  const email = {
    body: {
      greeting: `Hey There`,
      intro: [
        `Welcome onboard to Jamajama! Do click the link ${link} to verify your email within 10 days. Thanks for registering.`,
      ],

      action: {
        instructions: ``,
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
    from_name: 'Jamajama Support Team',
    to: userMail,
    subject: subject_matter,
    body_text: mailGenerator.generatePlaintext(email),
    html: mailGenerator.generate(email),
  };
  client.mailer.send(msg, function(err, result) {
    if (err) {
      return console.error(err);
    }

    // console.log(result);
  });
};

module.exports = { forgotPasswordEmail };
