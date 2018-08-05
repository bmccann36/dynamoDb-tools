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
const aws_sdk_1 = require("aws-sdk");
// @ts-ignore
const dynamodbLocal = __importStar(require("dynamodb-localhost"));
// @ts-ignore
const connection_tester_1 = __importDefault(require("connection-tester"));
class TableHelper {
    constructor(tableConfig, port) {
        this.tableConfig = tableConfig;
        this.port = port;
        this.dynamoDb = new aws_sdk_1.DynamoDB({ region: 'localhost', endpoint: `http://localhost:${this.port}` });
    }
    setUpLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                dynamodbLocal.install(resolve);
            });
            const connection = yield connection_tester_1.default.test('localhost', this.port, 1000);
            // if it isn't running start it
            if (connection.success !== true) {
                dynamodbLocal.start({ port: this.port });
            }
            // attempt to create the needed table, catch error if the table already exists 
            try {
                const tableCreationResult = yield this.dynamoDb.createTable(this.tableConfig).promise();
                console.log('created table:', this.tableConfig.TableName);
            }
            catch (e) {
                if (e.code == 'ResourceInUseException') {
                    console.log(`'table named "${this.tableConfig.TableName}" already exists, skipping table creation`);
                } // if it's another type of error don't bury it
                else {
                    throw e;
                }
            }
        });
    }
    tearDownLocal() {
        dynamodbLocal.stop(this.port);
    }
}
exports.TableHelper = TableHelper;
//# sourceMappingURL=tableHelper.js.map