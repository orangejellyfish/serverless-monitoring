const request = require('request-promise-native');
const AWS = require('aws-sdk');

const { slackHookUrl } = process.env

const getRequestOptions = (message) => ({
  method: 'POST',
  uri: slackHookUrl,
  body: {
      text: message
  },
  json: true
});

const isFailedPing = (sns) => sns.MessageAttributes.success.Value !== 'true';

module.exports.handler = async (event) => {
  const slackMessagePromises = event['Records']
    .filter(({ Sns }) => isFailedPing(Sns))
    .map(({ Sns }) => request(getRequestOptions(Sns.Message)));

  return Promise.all(slackMessagePromises);
}
