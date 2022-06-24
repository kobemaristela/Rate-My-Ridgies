import * as uuid from "uuid";
import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";


// {"name" : "mike", "role" : "P&E", "photo" : "test.jpg"}
export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      profileId: uuid.v1(),
      profileRole: data.role,
      profileName: data.name,
      profilePhoto: data.photo,
      profileLikes: 0,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});