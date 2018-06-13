const request = require('request-promise-native');
const AWS = require('aws-sdk');  
const ses = new AWS.SES({
  region: 'eu-west-1'
});

const URL = process.env.url;
const from = process.env.fromEmail;
const to = process.env.toEmail;

let getMailOptions = (from, to, message) => ({
  Destination: {
      ToAddresses: [to]
  },
  Message: {
      Body: {
          Text: {
              Data: message
          }
      },
      Subject: {
          Data: `${URL} in trouble!`
      }
  },
  Source: from
});

module.exports.handler = async (event, context) => {
  let messages = event['Records'].map(record => record.Sns.Message);
  // We want to error if out of bounds.
  let message = messages[0];

  return new Promise((resolve, reject) => {
    const mailOptions = getMailOptions(to, from, message);
  
    ses.sendEmail(mailOptions, function (err, info) {
        if (err) {
            console.log("Error sending email", err);
            reject(false);
        } else {
            console.log("Email sent successfully");
            resolve(true)
        }
    });
  });
}