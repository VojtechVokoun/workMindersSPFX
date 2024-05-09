import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { TSettings } from "../types/ItemTypes";

/**
 * Update the remote settings for the web part
 * @param context - the web part context
 * @param settings - the settings to update
 * @returns void
 */
export const updateSettings = async (
  context: WebPartContext,
  settings: TSettings,
): Promise<void> => {
  // Get the graph client
  const graphClient: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Update the settings
  await graphClient
    .api(`/me/drive/items/${settings.oneDriveId}/content`)
    .version("v1.0")
    .headers({
      "Content-Type": "application/json",
    })
    .put({
      tagList: settings.tagList,
    })
    .catch((error: unknown) => {
      console.error(`updateSettings: ${error}`);
    });

  return;
};
