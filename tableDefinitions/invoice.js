var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const localDb = new AWS.DynamoDB(
  {
    endpoint: new AWS.Endpoint('http://localhost:8000'),
    region: 'us-east-1'
  });

listTablesAsync()

// TO DO check to see if already exists
function listTablesAsync() {
  localDb.listTables().promise()
    .then(res => {
      console.log('found the following tables  ', res)
    })
    .catch(err => console.log(err))
}


function defineInvoiceTable() {
  var params = {
    AttributeDefinitions: [
      {
        AttributeName: 'ACCT_NUM',
        AttributeType: 'S'
      },
      {
        AttributeName: 'INVOICE_DOCUMENT_ID',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'ACCT_NUM',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'INVOICE_DOCUMENT_ID',
        KeyType: 'RANGE'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    },
    TableName: 'invoice-local'
  };
  localDb.createTable(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });
}

// putEntriesAsync(string)
// .then(res => console.log(`wrote ${res.length} items`))
// .catch(err => console.log('there was an error \n', err));


