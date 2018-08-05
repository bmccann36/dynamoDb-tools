import { DynamoDB } from 'aws-sdk';
import CreateTableInput = DynamoDB.DocumentClient.CreateTableInput;

import chalk from 'chalk';
// @ts-ignore
import * as dynamodbLocal from 'dynamodb-localhost';
// @ts-ignore
import connectionTester from 'connection-tester';

export class TableHelper {
  dynamoDb: DynamoDB;
  constructor(
    private tableConfig: CreateTableInput,
    private port: number,
  ) {
    this.dynamoDb = new DynamoDB({ region: 'localhost', endpoint: `http://localhost:${this.port}` });
  }

  async setUpLocal(): Promise<void> {
    await new Promise((resolve: any, reject: any) => {
      dynamodbLocal.install(resolve)
    })
    const connection = await connectionTester.test('localhost', this.port, 1000)
    // if it isn't running start it
    if (connection.success !== true) {
      dynamodbLocal.start({ port: this.port })
    }
    // attempt to create the needed table, catch error if the table already exists 
    try {
      const tableCreationResult = await this.dynamoDb.createTable(this.tableConfig).promise();
      console.log('created table:', this.tableConfig.TableName)
    } catch (e) {
      if (e.code == 'ResourceInUseException') {
        console.log(`'table named "${this.tableConfig.TableName}" already exists, skipping table creation`)
      } // if it's another type of error don't bury it
      else {
        throw e
      }
    }
  }

  tearDownLocal(): void {
    dynamodbLocal.stop(this.port)
  }


}
