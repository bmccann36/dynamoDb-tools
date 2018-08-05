"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
const chalk_1 = __importDefault(require("chalk"));
// deps for reading yaml
// @ts-ignore - read yaml doesn't have type def
const read = __importStar(require("read-yaml"));
const path = require('path');
const tableDefs = read.sync(path.join(__dirname, '..', './tableDef.yml'));
const pcMtable = tableDefs.PortCostsDynamoTable.Properties;
// dynamodb local
// @ts-ignore
const dynamodbLocal = __importStar(require("dynamodb-localhost"));
const connectionTester = require('connection-tester');
const dynamoDb = new AWS.DynamoDB({ region: 'localhost', endpoint: 'http://localhost:8000' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' });
tableHooks();
// const putParams = {
//   TableName: 'PCM_LOCAL',
//   Item: {
//     id_column: '07',
//     type_column: '07',
//   },
// };
//  docClient.put(putParams).promise();
function tableHooks() {
    return __awaiter(this, void 0, void 0, function* () {
        // check to see if dynamo is installed, if it isn't install it
        yield new Promise((resolve, reject) => {
            dynamodbLocal.install(resolve);
        });
        // check if process is already running on 8000 (assuming if it is it is dynamolocal and not another process)
        const connection = yield connectionTester.test('localhost', 8000, 1000);
        if (connection.success == true) {
            console.log(chalk_1.default.yellow('PROCESS ALREADY RUNNING ON PORT 8000'));
        } // if it isn't running start it
        else {
            dynamodbLocal.start({ port: 8000 });
        }
        // attempt to create the needed table, catch error if the table already exists 
        try {
            const tableCreationResult = yield dynamoDb.createTable(pcMtable).promise();
            console.log('created table:', pcMtable.TableName);
        }
        catch (e) {
            if (e.code == 'ResourceInUseException') {
                console.log(`'table named "${pcMtable.TableName}" already exists, skipping table creation`);
            } // if it's another type of error don't bury it
            else {
                throw e;
            }
        }
        // dynamodbLocal.stop(8000)
    });
}
//# sourceMappingURL=main.js.map