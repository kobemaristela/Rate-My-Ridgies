import * as uuid from "uuid";
import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";


// {"aboutProfileId" : "9f905ef0-f407-11ec-8edb-ef51f029ab5f", "revieweeName" : "Mike" , "reviewBody" : "good review"}
export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      revieweeProfileId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
      // could also be cognito pool
      revieweeName: data.revieweeName, 
      reviewId: uuid.v1(),
      reviewBody: data.reviewBody,
      likes: 0,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});