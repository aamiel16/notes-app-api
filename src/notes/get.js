import { success, failure } from './libs/response.lib';
import * as dynamoDb from "./libs/dynamodb.lib";

export async function handler(event) {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const params = {
      TableName: process.env.tableName,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: event.pathParameters.id
      }
    };

    const data = await dynamoDb.call("get", params);

    // Return not found error
    if (!data.Item) {
      return failure({ status: false, error: "Item not found" });
    }

    // Return status code 200 and the found item
    return success(data.Item);
  } catch (e) {
    console.log("[ERROR] @get.handler: ", e.message);
    return failure({ status: false });
  }
}
