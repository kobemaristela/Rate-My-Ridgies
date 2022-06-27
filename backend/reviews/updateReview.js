import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

// { "reviewBody" : "This is a change to the review" }
export const main = handler(async (event) => {
    const data = JSON.parse(event.body);

    const keys = Object.keys(data);

    // check to make sure only changing body or likes
    keys.forEach((key) => {
        if (key !== "reviewBody" || key !== "profileLikes"){
            throw "ERROR: Only allowed to change body and num likes"
        };
    })

    const params = {
        TableName: process.env.TABLE_NAME,
        // 'Key' defines the partition key and sort key of the item to be updated
        Key: {
            revieweeProfileId: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
            reviewId: event.pathParameters.id, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET reviewBody = :reviewBody, profileLikes = :profileLikes",
        ExpressionAttributeValues: {
            ":reviewBody": data.reviewBody || null,
            ":profileLikes": data.likes || null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { status: true };
});