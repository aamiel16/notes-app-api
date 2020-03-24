import { v1 as uuid } from "uuid";
import { success, failure } from "./libs/response.lib";
import * as dynamoDb from "./libs/dynamodb.lib";

export async function main(event) {
  try {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
      TableName: process.env.tableName,
      // 'Item' contains the attributes of the item to be created
      // - 'userId': user identities are federated through the
      //             Cognito Identity Pool, we will use the identity id
      //             as the user id of the authenticated user
      // - 'noteId': a unique uuid
      // - 'content': parsed from request body
      // - 'attachment': parsed from request body
      // - 'createdAt': current Unix timestamp
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        noteId: uuid(),
        content: data.content,
        attachment: data.attachment,
        createdAt: Date.now()
      }
    };

    await dynamoDb.call("put", params);

    // Return status code 200 and the newly created item
    return success(params.Item);
  } catch (e) {
    console.log("[ERROR] @create.main: ", e.message);
    return failure({ status: false });
  }
}
