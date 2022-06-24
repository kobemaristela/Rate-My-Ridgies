import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {

    const params = {
        TableName: process.env.TABLE_NAME,
    };

    const list = await dynamoDb.scan(params);   // Returns entire table entry

    // Loop through table and delete each element
    for (var i = 0; i < list.Items.length; ++i) {
    
        const del = {
            TableName: process.env.TABLE_NAME,
            // 'Key' defines the partition key and sort key of the item to be removed
            Key: {
                // userId: "123", // The id of the author
                profileId: list.Items[i].profileId,
            },
        };
    
        await dynamoDb.delete(del);
    }

    // Error Catching
    db = await dynamoDb.scan(params); 
    if(!db.Items){
        console.log("Database not cleared | " + db.Items)
        throw "Error: Database not cleared"
    }



    // await dynamoDb.deleteTable(del);
    // await dynamoDb.createTable(create)

    return { status: true };
});