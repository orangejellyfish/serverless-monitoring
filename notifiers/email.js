const AWS = require('aws-sdk');
const ses = new AWS.SES({
  region: process.env.region
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
  let messages = event['Records']
    .map(record => record.Sns)
    .filter(sns => sns.MessageAttributes.success.Value !== 'true')
    .map(sns => sns.Message);

  let emailPromises = messages
    .map(message =>
      ses
        .sendEmail(getMailOptions(to, from, message))
        .promise()
        .then(
          () => console.log("Email sent successfully."),
          (err) => console.error("Error sending email", err)));

  return Promise.all(emailPromises);
}
