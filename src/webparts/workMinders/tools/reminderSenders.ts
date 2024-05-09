import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { TWorkMinder } from "../types/ItemTypes";

/**
 * Update the reminder on OneDrive
 * @param context - the web part context
 * @param reminder - the reminder to update
 * @returns void
 */
export const updateReminder = async (
  context: WebPartContext,
  reminder: TWorkMinder,
): Promise<TWorkMinder> => {
  // Get the graph client
  const graphClient: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Update the reminder
  const updateResponse = await graphClient
    .api(`/me/drive/items/${reminder.oneDriveId}/content`)
    .version("v1.0")
    .headers({
      "Content-Type": "application/json",
    })
    .put({
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      isCompleted: reminder.isCompleted,
      isImportant: reminder.isImportant,
      linkedUsers: reminder.linkedUsers,
      linkedTeams: reminder.linkedTeams,
      linkedSpSites: reminder.linkedSpSites,
      linkedFiles: reminder.linkedFiles,
      tags: reminder.tags,
    })
    .catch((error: unknown) => {
      console.error(`updateSettings: ${error}`);
    });

  return {
    ...reminder,
    modifiedDate: updateResponse.lastModifiedDateTime,
  };
};

/**
 * Create a new reminder on OneDrive
 * @param context - the web part context
 * @param reminder - the reminder to create
 * @returns void
 */
export const createReminder = async (
  context: WebPartContext,
  reminder: TWorkMinder,
): Promise<TWorkMinder> => {
  // Get the graph client
  const graphClient: MSGraphClientV3 =
    await context.msGraphClientFactory.getClient("3");

  // Send the reminder
  const creationResponse = await graphClient
    .api(
      `/me/drive/root:/WorkMinders App/workminder_${reminder.title}.json:/content`,
    )
    .version("v1.0")
    .headers({
      "Content-Type": "application/json",
    })
    .put({
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      isCompleted: reminder.isCompleted,
      isImportant: reminder.isImportant,
      linkedUsers: reminder.linkedUsers,
      linkedTeams: reminder.linkedTeams,
      linkedSpSites: reminder.linkedSpSites,
      linkedFiles: reminder.linkedFiles,
      tags: reminder.tags,
    })
    .catch((error: unknown) => {
      console.error(`updateSettings: ${error}`);
    });

  // Return a new reminder with the OneDrive metadata
  return {
    ...reminder,
    oneDriveId: creationResponse.id,
    createdDate: creationResponse.createdDateTime,
    modifiedDate: creationResponse.lastModifiedDateTime,
  };
};
