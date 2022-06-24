import { createRequire as topLevelCreateRequire } from 'module'
const require = topLevelCreateRequire(import.meta.url)
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/StorageStack.js
import { Bucket, Table } from "@serverless-stack/resources";
function StorageStack({ stack }) {
  const bucket = new Bucket(stack, "Uploads");
  const table = new Table(stack, "Profile", {
    fields: {
      profileId: "string",
      reviewId: "string"
    },
    primaryIndex: { partitionKey: "profileId", sortKey: "reviewId" }
  });
  return {
    table,
    bucket
  };
}
__name(StorageStack, "StorageStack");

// stacks/index.js
function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm"
    }
  });
  app.stack(StorageStack);
}
__name(main, "main");
export {
  main as default
};
//# sourceMappingURL=index.js.map
