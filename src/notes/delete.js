import * as dynamoDbLib from "./libs/dynamodb.lib";
import { success, failure } from "./libs/response.lib";

export async function handler(event, context) {
  try {
    const params = {
      TableName: process.env.tableName,
      Key: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: event.pathParameters.id
      }
    };

    await dynamoDbLib.call("delete", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
