const AWS = require('aws-sdk');
const ses = new AWS.SES();

const { url, toEmail, fromEmail } = process.env

const getMailOptions = (from, to, message) => ({
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
          Data: `${url} in trouble!`
      }
  },
  Source: from
});

module.exports.handler = async (event) => {
  const messages = event['Records']
    .filter(({ Sns }) => Sns.MessageAttributes.success.Value !== 'true')
    .map(({ Sns }) => Sns.Message);

  const emailPromises = messages
    .map(message =>
      ses
        .sendEmail(getMailOptions(toEmail, fromEmail, message))
        .promise()
        .then(
          () => console.log("Email sent successfully."),
          (err) => console.error("Error sending email", err)));

  return Promise.all(emailPromises);
}
