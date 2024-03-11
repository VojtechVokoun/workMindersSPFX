import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { TUserSuggestion, TTeamSuggestion } from "./suggestionApiCallsTypes";

/**
 * This calls the Graph API to get the user autocomplete suggestions for a given search query.
 */
export const getUserSuggestions = async (
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

  // TODO: remove after testing
  console.log(userSuggestions);

  // Return the suggestions
  return userSuggestions.value;
};

/**
 * This calls the Graph API to get the user's manager. This is used in the webpart after entering a certain keyword.
 */
export const getManager = async (
  context: WebPartContext,
): Promise<TUserSuggestion> => {
  // Set up the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Get the user's manager
  const manager = await client.api("/me/manager").version("v1.0").get();

  // TODO: remove after testing
  console.log(manager);

  // Return the manager
  return manager;
};

/**
 * This calls the Graph API to get suggestions for the user's Teams based on the user's input.
 */
export const getTeamSuggestions = async (
  context: WebPartContext,
  query: string,
): Promise<TTeamSuggestion[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Set up the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Get the team suggestions
  const teamSuggestions = await client
    .api(`/me/joinedTeams?$filter=startswith(displayName,'${query}')`)
    .version("v1.0")
    .get();

  // TODO: remove after testing
  console.log(teamSuggestions);

  // Return the suggestions
  return teamSuggestions.value;
};
