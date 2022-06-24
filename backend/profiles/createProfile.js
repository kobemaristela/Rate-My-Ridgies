import * as uuid from "uuid";
import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";


// {"name" : "mike", "role" : "P&E", "photo" : "test.jpg"}
export const main = handler(async (event) => {
  const data = JSON.parse(event.body);

  // error catching
  if(!data.profileRole || !data.profileName || !data.profilePhoto){
    throw "ERROR: must have profileRole, profileName, profilePhoto"
  };

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      profileId: uuid.v1(),
      profileRole: data.profileRole,
      profileName: data.profileName,
      profilePhoto: data.profilePhoto,
      profileLikes: 0,
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});