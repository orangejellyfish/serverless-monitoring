const request = require('request-promise-native');
const AWS = require('aws-sdk');  
const sns = new AWS.SNS();

const URL = process.env.url;
const SNSTopicName = process.env.snsTopic;

let getSNSContext = lambdaContext => ({
  region: lambdaContext.invokedFunctionArn.split(':')[3],
  accountId: lambdaContext.invokedFunctionArn.split(':')[4]
});

let publisher = (snsContext) => (message) => 
  sns.publish({
      Message: message,
      TopicArn: `arn:aws:sns:${snsContext.region}:${snsContext.accountId}:${SNSTopicName}`
  }, function(err, data) {
      if (err) {
          console.log(err.stack);
          return;
      }
  });

module.exports.producer = async (event, context) => {
    let publishMessage = publisher(getSNSContext(context));
    return request(URL)
        .then(
          () => {},
          () => {
            publishMessage(`${URL} NOT available!`)
          }
        );
}