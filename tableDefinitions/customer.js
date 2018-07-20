var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const localDb = new AWS.DynamoDB(
  {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    region: 'us-east-1'
  });

  var params = {
    AttributeDefinitions: [
      {
        AttributeName: 'ACCT_NUM',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'ACCT_NUM',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    TableName: 'customer-local'
  };
  localDb.createTable(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });


// putEntriesAsync(string)
// .then(res => console.log(`wrote ${res.length} items`))
// .catch(err => console.log('there was an error \n', err));


