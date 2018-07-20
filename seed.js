const path = require('path')
const fs = require('fs')
const parse = require('csv-parse/lib/sync');
const buffer = fs.readFileSync(path.join(__dirname, '../customer.csv'))
const stringifiedCustomer = buffer.toString()
const records = parse(stringifiedCustomer, { columns: true });


const { docClient } = require('../../config');


console.log(records)


