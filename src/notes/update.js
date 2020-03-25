import { success, failure } from "./libs/response.lib";
import * as dynamoDb from "./libs/dynamodb.lib";

export async function handler(event) {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
      TableName: process.env.tableName,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: event.pathParameters.id,
      },
      UpdateExpression: 'SET content = :content, attachment = :attachment',
      ExpressionAttributeValues: {
        ":attachment": data.attachment || null,
        ":content": data.content || null
      },
      ReturnValues: "ALL_NEW",
    };

    const doc = await dynamoDb.call("update", params);

    // Return status code 200 and the newly created item
    return success(doc.Attributes);
  } catch (e) {
    console.log("[ERROR] @update.handler: ", e.message);
    return failure({ status: false });
  }
}
