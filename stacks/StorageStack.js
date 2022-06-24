import { Bucket, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }) {
  // Create an S3 bucket
  const bucket = new Bucket(stack, "Uploads");

  // Create the DynamoDB table
  const table = new Table(stack, "Profile", {
    fields: {
      profileId: "string",
      reviewId: "string",
    },
    primaryIndex: { partitionKey: "profileId", sortKey: "reviewId" },
  });

  // Return the bucket and table resources
  return {
    table,
    bucket,
  };
}
