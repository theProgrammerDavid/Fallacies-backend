
// Require handlebars
const hb = require('express-handlebars').create({
  extname: '.hbs',
  partialsDir: '.',
});

const path = require('path');

// Set up sendgrid API

const { SENDGRID_API_KEY } = process.env;
const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);

function sendEmails(email, link, action, cb) {
  // File containing the email template
  let fileName = '';
  if (action === 'verify') {
    fileName = path.join(__dirname, 'verify.hbs');
  }

  if (action === 'resetpass') {
    fileName = path.join(__dirname, 'reset.hbs');
  }
  // Define the email details
  const mailSubject = 'Fallacies by CSI-VIT'; // Enter mail subject
  const fromName = 'CSI-VIT'; // Enter from name
  const fromEmail = 'askcsivit@csivit.com'; // Enter from email
  const replyToMail = 'askcsivit@csivit.com'; // Reply-to email
  const replyToName = 'CSI-VIT'; // Reply-to name

  // Add the fields you want to template in the email
  const templateVals = {};
  templateVals.link = link;

  // Render the template and send the mail
  hb.render(fileName, templateVals).then((renderedHtml) => {
    const sgReq = Sendgrid.emptyRequest({

      method: 'POST',
      path: '/v3/mail/send',

      body: {
        personalizations: [{
          to: [{
            // name: name,
            email,
          }],
          subject: mailSubject,
        }],

        from: {
          name: fromName,
          email: fromEmail,
        },

        content: [{
          type: 'text/html',
          value: renderedHtml,
        }],

        replyTo: [{
          email: replyToMail,
          name: replyToName,
        }],
      },
    });

    Sendgrid.API(sgReq, (err) => {
      if (err) {
        console.log(err);
        cb(err);
      } else {
        cb(false);
      }
    });
  });
}

module.exports = sendEmails;
