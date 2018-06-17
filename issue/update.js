'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.title !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the article item.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#article_title': 'title',
      '#article_description': 'description',
      '#article_image': 'image',
      '#article_category': 'category',
      '#article_articles': 'articles',
    },
    ExpressionAttributeValues: {
      ':title': data.title,
      ':description': data.description || "",
      ':image': data.image || "",
      ':category': data.category || "",
      ':articles': data.articles || [],
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #article_title = :title, #article_description = :description, #article_category = :category, ' +
    '#article_image = :image, #article_articles = :articles, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the article in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the article item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin' : '*' },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
