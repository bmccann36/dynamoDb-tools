var AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
const parse = require('csv-parse/lib/sync');
const docClient = new AWS.DynamoDB.DocumentClient(
  {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    region: 'us-east-1'
  }
);

// converts buffer to array of objects with all empty strings converted to 'null' for dynamoDb entry
function makeBufferObject(buffer) {
  const str = buffer.toString()
  const records = parse(str, { columns: true });
  return records.map(record => {
    return makeEmptyNull(record);
  })
}
/**
 * asynchronously adds items to db. Does not resolve till all items are written
 * @param {array} entries normalized csv rows to be added to DB
 */
function putEntriesAsync(entries) {
  const pendingWrites = entries.map(item => {
    return writeItemAsync(item)
  });
  return Promise.all(pendingWrites)
    .then(res => {
      console.log('\n successfully wrote ' + res.length + 'items \n')
      return res
    })
    .catch(err => err);

}

// writes to db one item at a time
function writeItemAsync(item, tableName) {

  let params = {
    TableName: 'invoice-local',
    Item: item
  };
  return docClient.put(params).promise()
    .then(res => {
      return res
    })
    .catch(err => err)
}

// converts empty string to null so that dynamo doesn't throw error
function makeEmptyNull(doc) {
  let newDoc = Object.assign({}, doc);
  for (let prop in newDoc) {
    if (doc[prop] == '') {
      newDoc[prop] = null;
    }
  }
  return newDoc;
}


module.exports = { writeItemAsync, putEntriesAsync, makeBufferObject }
