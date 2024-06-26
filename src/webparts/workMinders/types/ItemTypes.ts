/**
 * This is the object containing the users returned by the Graph API.
 * @param id - the user's ID
 * @param displayName - the user's display name
 * @param mail - the user's email
 * @param userPrincipalName - the user's user principal name
 * @returns The user object.
 */
export type TUser = {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
};

/**
 * This is the object containing the teams returned by the Graph API.
 * @param id - the team's ID
 * @param displayName - the team's display name
 * @param url - the team's URL
 * @returns The team object.
 */
export type TTeam = {
  id: string;
  displayName: string;
  url: string;
};

/**
 * This is the object containing the sites returned by the SharePoint REST API.
 * @param id - the channel's ID
 * @param displayName - the channel's display name
 * @param webUrl - the channel's web URL
 * @returns The SP Site object.
 */
export type TSPSite = {
  id: string;
  displayName: string;
  webUrl: string;
};

/**
 * This is the object containing the files returned by the Graph API.
 * @param id - the file's ID
 * @param displayName - the file's display name
 * @param webUrl - the file's web URL
 * @param lastModifiedDateTime - the file's last modified date and time in ISO 8601 format
 * @returns The file object.
 */
export type TFile = {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
};
