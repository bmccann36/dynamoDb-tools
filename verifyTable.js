const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient(
  {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    region: 'us-east-1',
    apiVersion: '2012-08-10'
  }
);
var hashKey = 'ACCT_NUM';
var rangeKey = 'INVOICE_DOCUMENT_ID';

// scanTableAsync()
//   .then(res => console.log(res))

function scanTableAsync(tableName) {
  var scanParams = {
    TableName: tableName,
  };
  return dynamoDb.scan(scanParams).promise()
}

function getItemAsync(obj, tableName) {
  var params = {
    Key: buildKey(obj),
    TableName: tableName
  };
  return dynamoDb.get(params).promise()
    .then(res => res)
    .catch(err => err);
}


function buildKey(obj) {
  var key = {};
  key[hashKey] = obj[hashKey]
  if (rangeKey) {
    key[rangeKey] = obj[rangeKey];
  }
  return key;
}

module.exports = { getItemAsync, scanTableAsync }
