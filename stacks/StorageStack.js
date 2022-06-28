import { Bucket, Table } from "@serverless-stack/resources";
import { RemovalPolicy } from "aws-cdk-lib";

export function StorageStack({ stack }) {
  // Create an S3 bucket
  const bucket = new Bucket(stack, "Photos", {
    cors: [     // Enabled CORS to allow access in a different domain (populated by frontend)
      {
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  // Create the DynamoDB table
  const profiles = new Table(stack, "Profiles", {
    fields: {
      profileId: "string",
      profileName: "string",
      profileRole: "string",
      profilePhoto: "string",
      profileLikes: "number",
      createdAt: "number"
    },
    primaryIndex: { partitionKey: "profileId" },
    cdk: {
      table: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  const reviews = new Table(stack, "Reviews", {
    fields: {
      revieweeProfileId: "string",
      revieweeName: "string",
      reviewId: "string",
      reviewBody: "string",
      likes: "number",
      createdAt: "number"
    },
    primaryIndex: { partitionKey: "reviewId"},
    cdk: {
      table: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  // Return the bucket and table resources
  return {
    profiles,
    reviews,
    bucket,
  };
}
