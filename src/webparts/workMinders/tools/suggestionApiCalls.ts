import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  MSGraphClientV3,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import {
  TUserSuggestion,
  TTeamSuggestion,
  TSPSite,
} from "./suggestionApiCallsTypes";

/**
 * This calls the Graph API to get the user autocomplete suggestions for a given search query.
 */
export const getUserSuggestions = async (
  client: MSGraphClientV3,
  query: string,
): Promise<TUserSuggestion[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Get the user suggestions
  const userSuggestions = await client
    .api(
      `/users?$filter=startswith(displayName,'${query}') or startswith(mail,'${query}') or startswith(userPrincipalName,'${query}')`,
    )
    .version("v1.0")
    .select("id,displayName,mail,userPrincipalName")
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
  client: MSGraphClientV3,
): Promise<TUserSuggestion> => {
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
  client: MSGraphClientV3,
  query: string,
): Promise<TTeamSuggestion[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Get the team suggestions
  const teamSuggestions = await client
    .api(`/me/joinedTeams?$filter=startswith(displayName,'${query}')`)
    .version("v1.0")
    .select("id,displayName,webUrl")
    .get();

  // TODO: remove after testing
  console.log(teamSuggestions);

  // Return the suggestions
  return teamSuggestions.value;
};

/**
 * This calls the Graph API to get all the sites that the user has access to.
 * This function is called when the webpart is loaded – that is because the neither the SharePoint REST API nor the
 * Graph API is able to query the user's sites based on the user's input. (The 'starts with' filter is not supported,
 * both APIs only return sites if the name and search query are matching.)
 */
export const getSites = async (context: WebPartContext): Promise<TSPSite[]> => {
  // Set up the SharePoint HTTP client
  const client: SPHttpClient = context.spHttpClient;

  // Get the user's sites
  const clientResponse: any = await client
    .get(
      `${context.pageContext.web.absoluteUrl}/_api/search/query?querytext='contentclass:STS_Site'&rowlimit=500`,
      SPHttpClient.configurations.v1,
    )
    .then((response: SPHttpClientResponse) => {
      return response.json();
    });

  const loadedSites: any[] =
    clientResponse.PrimaryQueryResult.RelevantResults.Table.Rows;

  const processedSites: TSPSite[] = [];

  loadedSites.map((site) => {
    processedSites.push({
      id: site.Cells[46].Value,
      displayName: site.Cells[2].Value,
      webUrl: site.Cells[5].Value,
    });
  });

  // TODO: remove after testing
  console.log(processedSites);

  // Return the suggestions
  return processedSites;
};
