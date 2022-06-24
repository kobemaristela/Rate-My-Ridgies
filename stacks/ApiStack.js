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
          TABLE_NAME: profiles.tableName,
        },
      },
    },
    routes: {
      "POST /profiles": "profiles/createProfile.main",


      "GET /profiles/{id}": "profiles/getProfile.main",
      "PUT /profiles/{id}": "profiles/updateProfile.main",
      "DELETE /profiles/{id}": "profiles/deleteProfile.main",
    },
  });

  // Create the API
  // const reviewsApi = new Api(stack, "ReviewsApi", {
  //   defaults: {
  //     function: {
  //       permissions: [reviews],
  //       environment: {
  //         TABLE_NAME: reviews.tableName,
  //       },
  //     },
  //   },
  //   routes: {
  //     "POST /reviews": "reviews/functions/create.main",
  //   },
  // });

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