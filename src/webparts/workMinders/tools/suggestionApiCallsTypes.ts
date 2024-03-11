/**
 * This is the object containing the user suggestions returned by the Graph API.
 * It is used in the getUserSuggestions and getManager function.
 * @param id - the user's ID
 * @param displayName - the user's display name
 * @param mail - the user's email
 * @param userPrincipalName - the user's user principal name
 * @returns The user suggestion object.
 */
export type TUserSuggestion = {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
};

/**
 * This is the object containing the team suggestions returned by the Graph API. It is used in the getTeamSuggestions function.
 * @param id - the team's ID
 * @param displayName - the team's display name
 * @param url - the team's URL
 * @returns The team suggestion object.
 */
export type TTeamSuggestion = {
  id: string;
  displayName: string;
  url: string;
};
