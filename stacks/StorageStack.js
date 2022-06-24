import { Bucket, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }) {
  // Create an S3 bucket
  const bucket = new Bucket(stack, "Photos");

  // Create the DynamoDB table
  const profiles = new Table(stack, "Profiles", {
    fields: {
      profileId: "string",
      profileName: "string",
      profileRole: "string",
      photo: "string",
      likes: "number",
    },
    primaryIndex: { partitionKey: "profileId" },
  });

  const reviews = new Table(stack, "Reviews", {
    fields: {
      profileId: "string",
      reviewId: "string",
      body: "string"
    },
    primaryIndex: { partitionKey: "reviewId"},
  });

  // Return the bucket and table resources
  return {
    profiles,
    reviews,
    bucket,
  };
}
