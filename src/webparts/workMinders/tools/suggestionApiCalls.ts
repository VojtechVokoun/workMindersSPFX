import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  MSGraphClientV3,
  SPHttpClient,
  SPHttpClientConfiguration,
  ODataVersion,
  ISPHttpClientConfiguration,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import {
  TUserSuggestion,
  TTeamSuggestion,
  TSPSite,
  TFile,
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
    .get()
    .catch((error: unknown) => {
      console.error(`getUserSuggestions: ${error}`);
      return null;
    });

  // TODO: remove after testing
  console.log(userSuggestions.value);

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
  const manager = await client
    .api("/me/manager")
    .version("v1.0")
    .get()
    .catch((error: unknown) => {
      console.error(`getManager: ${error}`);
      return null;
    });

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
    .get()
    .catch((error: unknown) => {
      console.error(`getTeamSuggestions: ${error}`);
      return null;
    });

  // TODO: remove after testing
  console.log(teamSuggestions.value);

  // Return the suggestions
  return teamSuggestions.value;
};

/**
 * This calls the SharePoint REST API to get all the sites that the user has access to.
 * This function is called when the webpart is loaded – that is because the neither the SharePoint REST API nor the
 * Graph API is able to query the user's sites based on the user's input. (The 'starts with' filter is not supported,
 * both APIs only return sites if the name and search query are matching.)
 */
export const getSites = async (context: WebPartContext): Promise<TSPSite[]> => {
  // Set up the SharePoint HTTP client
  const client: SPHttpClient = context.spHttpClient;

  // Set up the SharePoint HTTP client configuration
  const spSearchConfig: ISPHttpClientConfiguration = {
    defaultODataVersion: ODataVersion.v3,
  };
  const clientConfigODataV3: SPHttpClientConfiguration =
    SPHttpClient.configurations.v1.overrideWith(spSearchConfig);

  // Get the user's sites
  const clientResponse: SPHttpClientResponse | null = await client
    .get(
      `${context.pageContext.web.absoluteUrl}/_api/search/query?querytext='contentclass:STS_Site'&rowlimit=500`,
      clientConfigODataV3,
    )
    .catch((error: unknown) => {
      console.error(`getSites: ${error}`);
      return null;
    });

  if (!clientResponse) {
    return [];
  }

  // Process the response
  const processedResponse: any = await clientResponse.json();

  const loadedSites: any[] =
    processedResponse.PrimaryQueryResult.RelevantResults.Table.Rows;

  const finalSites: TSPSite[] = [];

  loadedSites.map((site) => {
    finalSites.push({
      id: site.Cells[46].Value,
      displayName: site.Cells[2].Value,
      webUrl: site.Cells[5].Value,
    });
  });

  // TODO: remove after testing
  console.log(finalSites);

  // Return the suggestions
  return finalSites;
};

/**
 * This calls the Graph API to get the user's recent files.
 * This function is called when the webpart is loaded – that is because the Graph API is able to query the user's recent
 * files based on the user's input.
 */
export const getRecentFiles = async (
  client: MSGraphClientV3,
): Promise<TFile[]> => {
  // Get the user's recent files
  const recentFiles = await client
    .api("/me/drive/recent")
    .version("v1.0")
    .top(500)
    .get()
    .catch((error: unknown) => {
      console.error(`getRecentFiles: ${error}`);
      return null;
    });

  // TODO: remove after testing
  console.log(recentFiles.value as TFile[]);

  return recentFiles.value as TFile[];
};
