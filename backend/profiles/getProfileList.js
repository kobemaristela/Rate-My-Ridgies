import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async () => {
  const params = {
    TableName: process.env.TABLE_NAME,
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});