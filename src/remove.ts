// @ts-ignore
import * as dynamodbLocal from 'dynamodb-localhost';


  dynamodbLocal.remove(()=>{
    console.log('done')
  });

