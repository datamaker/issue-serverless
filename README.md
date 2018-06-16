# Issue-serverless
구글 캠퍼스 해커톤 2018 Issue 서버리스 REST API

# issue-serverless
이슈 조회 및 생성 Serverless RESTful API 입니다.


<!--
title: AWS Serverless REST API example in NodeJS
description: This example demonstrates how to setup a RESTful Web Service allowing you to create, list, get, update and delete Todos. DynamoDB is used to store the data.
layout: Doc
-->
# Serverless REST API

This example demonstrates how to setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete Todos. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## Structure

This service has a separate directory for all the todo operations. For each operation exactly one file exists e.g. `todos/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

The idea behind the `todos` directory is that in case you want to create a service containing multiple resources e.g. users, notes, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
npm install
```

## Deploy

In order to deploy the endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: serverless-rest-api-with-dynamodb
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/todos
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/todos
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
  PUT - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
  DELETE - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/todos/{id}
functions:
  serverless-rest-api-with-dynamodb-dev-update: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-update
  serverless-rest-api-with-dynamodb-dev-get: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-get
  serverless-rest-api-with-dynamodb-dev-list: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-list
  serverless-rest-api-with-dynamodb-dev-create: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-create
  serverless-rest-api-with-dynamodb-dev-delete: arn:aws:lambda:us-east-1:488110005556:function:serverless-rest-api-with-dynamodb-dev-delete
```

## Usage

You can create, retrieve, update, or delete issue with the following commands:

### Create a Issue

```bash
curl -X POST https://serverless.arteight.co.kr/v1/issue --data '{ "text": "Learn Serverless" }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa81-11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### List all Issues

```bash
curl https://serverless.arteight.co.kr/v1/issue
```

Example output:
```bash
[{"text":"Deploy my first service","id":"ac90fe80-aa83-11e6-9ede-afdfa051af86","checked":true,"updatedAt":1479139961304},{"text":"Learn Serverless","id":"20679390-aa85-11e6-9ede-afdfa051af86","createdAt":1479139943241,"checked":false,"updatedAt":1479139943241}]%
```

### Get one Issue

```bash
# Replace the <id> part with a real id from your issue table
curl https://serverless.arteight.co.kr/v1/issue/<id>
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa81-11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### Update a Issue

```bash
# Replace the <id> part with a real id from your issue table
curl -X PUT https://serverless.arteight.co.kr/v1/issue/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa81-11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":true,"updatedAt":1479138570824}%
```

### Delete a Issue

```bash
# Replace the <id> part with a real id from your issue table
curl -X DELETE https://serverless.arteight.co.kr/v1/issue/<id>
```

No output

## Scaling

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify how much provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decreasing capacity as needed.

This is can be done via settings in the `serverless.yml`.

```yaml
  ProvisionedThroughput:
    ReadCapacityUnits: 1
    WriteCapacityUnits: 1
```

In case you expect a lot of traffic fluctuation we recommend to checkout this guide on how to auto scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)


<!--
title: API Gateway Authorizer Function for Auth0 or AWS Cognito using RS256 JSON Web Key Sets tokens.
description: Authorize your API Gateway with either Auth0 or Cognito JWKS RS256 tokens.
layout: Doc
-->
# API Gateway Authorizer Function for Auth0 or AWS Cognito using the [JWKS](https://auth0.com/docs/jwks) method.

This is an example of how to protect API endpoints with [Auth0](https://auth0.com/) or [AWS Cognito](https://aws.amazon.com/cognito/) using JSON Web Key Sets ([JWKS](https://auth0.com/docs/jwks)) and a [custom authorizer lambda function](https://serverless.com/framework/docs/providers/aws/events/apigateway#http-endpoints-with-custom-authorizers).

Custom Authorizers allow you to run an AWS Lambda Function via API Gateway before your targeted AWS Lambda Function is run. This is useful for Microservice Architectures or when you simply want to do some Authorization before running your business logic.


## Use cases

- Protect API routes for authorized users
- Rate limiting APIs
- Remotely revoke tokens

## Setup

1. `npm install` json web token dependencies

2. In [auth.js](auth.js#L10) replace the value of `iss` with either your [Auth0 iss](http://bit.ly/2hoeRXk) or [AWS Cognito ISS](http://amzn.to/2fo77UI). Make sure the `iss` url ends in a trailing `/`.

  ```js
  /* auth.js */
  // Replace with your auth0 or Cognito values
  const iss = "https://<url>.com/";
  ```

3. Deploy the service with `sls deploy` and grab the public and private endpoints.

## Test Authentication:
-  Test with [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en): Make a new GET request with the Header containing "Authorization" with the value being "bearer `<id_token>`" for your `api/private` url.
- Test using curl:
  ```sh
  curl --header "Authorization: bearer <id_token>" https://{api}.execute-api.{region}.amazonaws.com/api/private
  ```


  ```
  gwonjeongbin-ui-iMac:issue-serverless dm$ sls create_domain
  Serverless: 'serverless.arteight.co.kr' was created/updated. New domains may take up to 40 minutes to be initialized.



  auth:
    handler: auth/auth.authorize

  publicEndpoint:
    handler: auth/handler.publicEndpoint
    events:
      - http:
          path: auth/public
          method: get
          integration: lambda
          cors: true

  privateEndpoint:
    handler: auth/handler.privateEndpoint
    events:
      - http:
          path: auth/private
          method: get
          authorizer: auth
          cors:
            origins:
              - '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token


  ```
