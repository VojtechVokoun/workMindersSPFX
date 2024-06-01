import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientConfiguration,
  MSGraphClientV3,
  ODataVersion,
  SPHttpClient,
  SPHttpClientConfiguration,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { TFile, TSPSite, TTeam, TUser } from "../types/ItemTypes";

/**
 * This calls the Graph API to get the user autocomplete suggestions for a given search query.
 * @param context - the webpart context
 * @param query - the search query
 * @returns The user suggestions based on the search query
 */
export const getUserSuggestions = async (
  context: WebPartContext,
  query: string,
): Promise<TUser[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Get the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

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

  // Return the suggestions
  return userSuggestions.value;
};

/**
 * This calls the Graph API to get the user's manager. This is used in the webpart after entering a certain keyword.
 * @param context - the webpart context
 * @returns The user's manager
 */
export const getManager = async (context: WebPartContext): Promise<TUser> => {
  // Get the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Get the user's manager
  // Return the manager
  return await client
    .api("/me/manager")
    .version("v1.0")
    .get()
    .catch((error: unknown) => {
      console.error(`getManager: ${error}`);
      return null;
    });
};

/**
 * This calls the Graph API to get suggestions for the user's Teams based on the user's input.
 * @param context - the webpart context
 * @param query - the search query
 * @returns The team suggestions based on the search query
 */
export const getTeamSuggestions = async (
  context: WebPartContext,
  query: string,
): Promise<TTeam[]> => {
  // If the query is too short, return an empty array
  if (query.length < 3) {
    return [];
  }

  // Get the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

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

  // Return the suggestions
  return teamSuggestions.value;
};

/**
 * This calls the SharePoint REST API to get all the sites that the user has access to.
 * This function is called when the component is loaded – that is because the neither the SharePoint REST API nor the
 * Graph API is able to query the user's sites based on the user's input. (The 'starts with' filter is not supported,
 * both APIs only return sites if the name and search query are matching.)
 * ! It is known that the Graph API would be better suited, but from experience, this specific functionality is not
 * ! as stable as the SharePoint REST API just yet.
 * @param context - the webpart context
 * @returns The user's sites
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
  // Disable the eslint rule for the next line because the response is not typed the same between tenants
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const processedResponse: any = await clientResponse.json();
  const loadedSites: any[] =
    processedResponse.PrimaryQueryResult.RelevantResults.Table.Rows;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const finalSites: TSPSite[] = [];

  loadedSites.map((site) => {
    finalSites.push({
      id: site.Cells[46].Value,
      displayName: site.Cells[2].Value,
      webUrl: site.Cells[5].Value,
    });
  });

  // Return the suggestions
  return finalSites;
};

/**
 * This calls the Graph API to get the user's recent files.
 * This function is called when the component is loaded – that is because the Graph API is uable to query the user's
 * recent files based on the user's input.
 * @param context - the webpart context
 * @returns The user's recent files
 */
export const getRecentFiles = async (
  context: WebPartContext,
): Promise<TFile[]> => {
  // Get the Graph client
  const client: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

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

  return recentFiles.value as TFile[];
};
