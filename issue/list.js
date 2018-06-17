'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.list = (event, context, callback) => {
  // fetch all article from the database
  console.log('event!!!', event, event.queryStringParameters);

  // query
  const queryParams = event.queryStringParameters;

  if (queryParams) {
      console.log('queryParams!!!', queryParams.category, queryParams.keyword);
  }

  const params = {
      TableName: process.env.DYNAMODB_TABLE,
  };

  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the article.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin' : '*' },
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
