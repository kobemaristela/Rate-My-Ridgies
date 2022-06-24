import handler from "../../util/handler";
import dynamoDb from "../../util/dynamodb";

export const main = handler(async (event) => {

    const params = {
        // looked at the process.env and there is no Tablename
        TableName: process.env.TABLE_NAME,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        Key: {
            // userId: "123", // The id of the author
            profileId: event.pathParameters.id, // The id of the note from the path
            // userId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return result.Item;
});