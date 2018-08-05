
import { DynamoDB } from 'aws-sdk';
import { expect } from 'smartchai';

// @ts-ignore - read yaml doesn't have type def
import * as read from 'read-yaml';
import chalk from 'chalk';
import path from 'path';
const tableConfigFile = read.sync(path.join(__dirname, '..', '..', './tableDef.yml'));
const pcMtableConfig = tableConfigFile.PortCostsDynamoTable.Properties;
import { TableHelper } from '../src/tableHelper'


const TEST_PORT = 8000

const docClient = new DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: `http://localhost:${TEST_PORT}`,
});


describe('INTEGRATION TESTS', async () => {
  const tableHelper = new TableHelper(pcMtableConfig, TEST_PORT)

  before(async () => {
    await tableHelper.setUpLocal()

  });

  after(async () => {
    tableHelper.tearDownLocal()
  });

  // SILLY META TEST if you just want to check that the local db connection is working properly
  it('connects to local db', async () => {

    const putParams = {
      TableName: pcMtableConfig.TableName,
      Item: {
        id_column: 'test string',
        type_column: 'test string',
      },
    };
    await docClient.put(putParams).promise();
    const params = { TableName: pcMtableConfig.TableName };
    const result = await docClient.scan(params).promise();
    // console.log(result.Items)
    expect(result.Items[0]).to.deep.equal({ type_column: 'test string', id_column: 'test string' });
  });




});



