import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";

type TUserSuggestion = {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
};

/**
 * This calls the Graph API to get the user autocomplete suggestions for a given search query.
 */
const getUserSuggestions = async (
  context: WebPartContext,
  query: string,
): Promise<TUserSuggestion[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Set up the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Get the user suggestions
  const userSuggestions = await client
    .api(
      `/users?$filter=startswith(displayName,'${query}') or startswith(mail,'${query}') or startswith(userPrincipalName,'${query}')`,
    )
    .version("v1.0")
    .get();

  // Return the suggestions
  return userSuggestions.value;
};
