## using a local db with mocha tests

### ./__tests_/sample.spec.ts

the purpose of this file is to serve as a template for how an integration test with dynamodb-localhost might work

- table configuration: the test file reads in a yaml file defining the table to be tested. This idea is to use the actual definition file that is used in deploying the app, this way the test table matches the schema of the production table 

- hooks: the test file references a helper class in before and after hook to get the table ready to test without worrying about details. The test file itself will interact with dynmodb local and therefore declares it's own instance. The table helper well set up your db / table on the specified port, docClient (or your code using docClient) will talk to that port.


### tableHelper.ts

- setUpLocal Method: 
- calls dynamoDb install, skips installation if you already have it. If dynamoDb local is not installed in the project directory the test will timeout and fail. Once installation finished run again
- checks to see if a process is already running on the specified port. If the port is already occupied the helper will not try to connect. If port is open it will connect 
- based on the configuaration arg that was passed in tableHelper will attempt to define a new table in the dynamodb local instance. If a table with that name already exists it will skip creation 

- tearDowLocal Method: 
stops the dynamodb local process so terminal window is not left hanging

### keeping an instance of dynamodb local running 

I recommend starting dynamodb local on the port seperately from the test file. The main adavantages being

- You don't have to keep re-making the table. Making the table is slow and can cause tests to time out. Optionally you can always specify the mocha timeout to get around this but why waste time waiting for the table to be created each time the test runs?

- By keeping the db running you can interact with it before and after running tests or writing code. You can run any dynamo cmmands in the web shell to see what your code is doing. When the process is restarted all your tables and items will go away.  

### using dynamo-db local without using dynamodb-localhost node module directly 

- run the java file: 
when the install is automatically triggered by dynamodb-local host the code to run dynamodb-local is saved within the dynamodb-localhost node module folder. see README in /bin for more details 

you can also get it from the aws website and save somewhere else if you like 

- run with serverless dynamodb-local 
https://www.npmjs.com/package/serverless-dynamodb-local
