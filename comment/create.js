'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the comment item.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE_COMMENT,
    Item: {
      id: uuid.v1(),
      username: data.username,
      issueId: data.issueId,
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the comment to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the comment item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin' : '*' },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
