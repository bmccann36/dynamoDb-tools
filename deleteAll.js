const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const chalk = require('chalk')

module.exports = deleteAllAsync

const dynamoDb = new AWS.DynamoDB.DocumentClient(
  {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    region: 'us-east-1'
  }
);
var hashKey = 'ACCT_NUM';
var rangeKey = 'INVOICE_DOCUMENT_ID';
// var tableName = 'invoice-local';

function deleteAllAsync(tableName) {
  var scanParams = {
    TableName: tableName,
  };

  return dynamoDb.scan(scanParams).promise()
    .then(data => {
      const pendingDeletes = data.Items.map(obj => {
        return deleteItemAsync(obj, scanParams)
      })
      return Promise.all(pendingDeletes)
        .then(res => {
          magenta('deleted all items from table')
          return res
        })
    })

}

function deleteItemAsync(item, scanParams) {
  // console.log('deleting item', item[rangeKey])
  const params = {
    TableName: scanParams.TableName,
    Key: buildKey(item)
  };
  return dynamoDb.delete(params).promise()
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



function magenta(str) {
  console.log(chalk.magenta(str))
}




