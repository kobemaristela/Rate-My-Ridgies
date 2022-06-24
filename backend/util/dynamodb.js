import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();
// const table = new AWS.DynamoDB();

export default {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
  scan: (params) => client.scan(params).promise(),
  // deleteTable: (params) => table.deleteTable(params).promise(),
  // createTable: (params) => table.createTable(params).promise(),
};
