import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { profilesApi, reviewsApi, testApi } = use(ApiStack);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Auth(stack, "Auth", {
    login: ["username"],
  });

  auth.attachPermissionsForAuthUsers([
    // Allow access to the API
    profilesApi,
    reviewsApi,

    // Policy granting access to a specific folder in the bucket
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);

  // Create auth provider
const testAuth = new Auth(stack, "testAuth", {
  identityPoolFederation: {
    google: {
      clientId:
        "584746172344-j3j0bkkqrjsmkgg2vpi4uq4vsov9mr5i.apps.googleusercontent.com",
    },
  },
});

// Allow authenticated users invoke API
testAuth.attachPermissionsForAuthUsers([testApi]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
    TestIdentityPoolId: testAuth.cognitoIdentityPoolId,
  });

  // Return the auth resource
  return {
    auth,
  };
}