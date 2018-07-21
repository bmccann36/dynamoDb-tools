
// update

  var params = {
    TableName: `vendorzones-microservice-steve-VendorZoneDynamoTable-69GKUEQ2U3JY`,
    Key: { id: '50d51efb-c5c1-414a-9925-9136c37aeab2' },
    UpdateExpression: 'set #em = :em',
    ExpressionAttributeNames: { '#em': 'endMile' },
    ExpressionAttributeValues: {
      ':em': 1
    }
  };
  
  
