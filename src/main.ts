import * as AWS from 'aws-sdk';
import chalk from 'chalk';
// deps for reading yaml
// @ts-ignore - read yaml doesn't have type def
import * as read from 'read-yaml';
const path = require('path');
const tableDefs = read.sync(path.join(__dirname, '..', './tableDef.yml'));
const pcMtable = tableDefs.PortCostsDynamoTable.Properties;
// dynamodb local
// @ts-ignore
import * as dynamodbLocal from 'dynamodb-localhost';
const connectionTester = require('connection-tester');

const dynamoDb = new AWS.DynamoDB({ region: 'localhost', endpoint: 'http://localhost:8000' });

const docClient = new AWS.DynamoDB.DocumentClient({region: 'localhost',endpoint: 'http://localhost:8000'});

tableHooks()

// const putParams = {
//   TableName: 'PCM_LOCAL',
//   Item: {
//     id_column: '07',
//     type_column: '07',
//   },
// };
//  docClient.put(putParams).promise();


async function tableHooks() {

  // check to see if dynamo is installed, if it isn't install it
  await new Promise((resolve: any, reject: any) => {
    dynamodbLocal.install(resolve)
  })
  // check if process is already running on 8000 (assuming if it is it is dynamolocal and not another process)
  const connection = await connectionTester.test('localhost', 8000, 1000)
  if (connection.success == true) {
    console.log(chalk.yellow('PROCESS ALREADY RUNNING ON PORT 8000'))
  }  // if it isn't running start it
  else {
    dynamodbLocal.start({ port: 8000 })
  }
  // attempt to create the needed table, catch error if the table already exists 
  try {
    const tableCreationResult = await dynamoDb.createTable(pcMtable).promise();
    console.log('created table:', pcMtable.TableName)
  } catch (e) {
    if (e.code == 'ResourceInUseException') {
      console.log(`'table named "${pcMtable.TableName}" already exists, skipping table creation`)
    } // if it's another type of error don't bury it
    else {
      throw e
    }
  }

  // dynamodbLocal.stop(8000)
}





