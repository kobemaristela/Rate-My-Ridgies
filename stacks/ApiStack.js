import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { profiles, reviews } = use(StorageStack);

  // Create the API
  const profilesApi = new Api(stack, "ProfilesApi", {
    defaults: {
      function: {
        permissions: [profiles],
        environment: {
          PROFILES_NAME: profiles.tableName,
        },
      },
    },
    routes: {
      "POST /profiles": "backend/profiles/functions/create.main",
    },
  });

  // Create the API
  const reviewsApi = new Api(stack, "ReviewsApi", {
    defaults: {
      function: {
        permissions: [reviews],
        environment: {
          REVIEWS_NAME: reviews.tableName,
        },
      },
    },
    routes: {
      "POST /reviews": "backend/reviews/functions/create.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ProfilesApiEndpoint: profilesApi.url,
    // ReviewsApiEndpoint: reviewsApi.url,
  });

  // Return the API resource
  return {
    profilesApi,
    // reviewsApi,
  };
}