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
const smartchai_1 = require("smartchai");
// @ts-ignore - read yaml doesn't have type def
const read = __importStar(require("read-yaml"));
const path_1 = __importDefault(require("path"));
const tableConfigFile = read.sync(path_1.default.join(__dirname, '..', '..', './tableDef.yml'));
const pcMtableConfig = tableConfigFile.PortCostsDynamoTable.Properties;
const tableHelper_1 = require("../src/tableHelper");
const TEST_PORT = 8000;
const docClient = new aws_sdk_1.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: `http://localhost:${TEST_PORT}`,
});
describe('INTEGRATION TESTS', () => __awaiter(this, void 0, void 0, function* () {
    const tableHelper = new tableHelper_1.TableHelper(pcMtableConfig, TEST_PORT);
    before(() => __awaiter(this, void 0, void 0, function* () {
        yield tableHelper.setUpLocal();
    }));
    after(() => __awaiter(this, void 0, void 0, function* () {
        tableHelper.tearDownLocal();
    }));
    // SILLY META TEST if you just want to check that the local db connection is working properly
    it('connects to local db', () => __awaiter(this, void 0, void 0, function* () {
        const putParams = {
            TableName: pcMtableConfig.TableName,
            Item: {
                id_column: 'test string',
                type_column: 'test string',
            },
        };
        yield docClient.put(putParams).promise();
        const params = { TableName: pcMtableConfig.TableName };
        const result = yield docClient.scan(params).promise();
        // console.log(result.Items)
        smartchai_1.expect(result.Items[0]).to.deep.equal({ type_column: 'test string', id_column: 'test string' });
    }));
}));
//# sourceMappingURL=sample.spec.js.map