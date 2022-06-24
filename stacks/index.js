import { StorageStack } from "./StorageStack";

export default function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm",
    },
  });
  app.stack(StorageStack);
}
