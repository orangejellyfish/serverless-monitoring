# serverless-monitoring

Service for monitoring URLs using serverless architecture.

After deploying, this service starts monitoring the provided URL and sends an e-mail if the URL cannot be reached. The monitoring is done using polling, with 1 minute frequency.

## Installation

```
 npm install -g serverless
 ```

## Deployment
```
serverless deploy --fromEmail <sender's e-mail address> --toEmail <recipient's e-mail address> --url <URL to monitor> --stage <dev|production>
```

## Clean slate

```
serverless remove --fromEmail < sender's e-mail address > --toEmail < recipient's e-mail address > --url < URL to monitor > --stage <dev|production>
 ```

Note:
 - Make sure you set your AWS Credentials.
 - You will need to verify the TO and FROM e-mail addresses for AWS SES.
 - You will need to check your e-mails and confirm an AWS invitation.

See more at:
 - https://serverless.com/framework/docs/providers/aws/guide/quick-start/
 - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html

