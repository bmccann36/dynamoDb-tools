

const params = {
  TableName: 'vendorzones-microservice-brian-VendorZoneDynamoTable-1NZ0Y008JB43D',
  Item: model,
  ConditionExpression: 'vendorId <> :vId AND zoneName <> :zNm',
  ExpressionAttributeValues: {
    ':vId': model.vendorId,
    ':zNm': model.zoneName,
  },
};
client.put(params).promise()
