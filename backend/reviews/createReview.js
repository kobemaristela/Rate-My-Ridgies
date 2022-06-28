import * as uuid from "uuid";
import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";


// {"revieweeProfileId" : "3805c230-f654-11ec-bf0b-155e61573ec8", "revieweeName" : "Mike" , "reviewBody" : "good review"}
export const main = handler(async (event) => {
  const data = JSON.parse(event.body);
  
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      revieweeProfileId: data.revieweeProfileId,
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