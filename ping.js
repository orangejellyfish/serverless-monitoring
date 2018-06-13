const request = require('request-promise-native');
const AWS = require('aws-sdk');  
const sns = new AWS.SNS();

const URL = process.env.url;
const SNSTopicName = process.env.snsTopic;

let getSNSContext = lambdaContext => ({
  region: lambdaContext.invokedFunctionArn.split(':')[3],
  accountId: lambdaContext.invokedFunctionArn.split(':')[4]
});

let publisher = (snsContext) => (message, success) => 
  sns.publish({
      Message: message,
      MessageAttributes: {
        success: {
          DataType: 'String', 
          StringValue: success
        }
      },
      TopicArn: `arn:aws:sns:${snsContext.region}:${snsContext.accountId}:${SNSTopicName}`
  }, (err) => {
      if (err) {
          console.log(err.stack);
          return; 
      }
  });

module.exports.handler = async (event, context) => {
    let publishMessage = publisher(getSNSContext(context));
    return request(URL)
        .then(
          () => {
            publishMessage(`${URL} IS available!`, 'true')
            return true;
          },
          () => {
            publishMessage(`${URL} NOT available!`, 'false')
            return false;   
          } 
        );
}