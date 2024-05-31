import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { TFile, TSPSite, TTeam, TUser } from "../types/ItemTypes";
import { Settings } from "./Settings";

export class WorkMinder {
  localId: number;
  title: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  dueDate: string;
  isCompleted: boolean;
  isImportant: boolean;
  linkedUsers: TUser[];
  linkedTeams: TTeam[];
  linkedSpSites: TSPSite[];
  linkedFiles: TFile[];
  tags: string[];

  constructor(
    localId: number,
    title: string,
    description: string,
    createdDate: string,
    modifiedDate: string,
    dueDate: string,
    isCompleted: boolean,
    isImportant: boolean,
    linkedUsers: TUser[],
    linkedTeams: TTeam[],
    linkedSpSites: TSPSite[],
    linkedFiles: TFile[],
    tags: string[],
  ) {
    this.localId = localId;
    this.title = title;
    this.description = description;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
    this.dueDate = dueDate;
    this.isCompleted = isCompleted;
    this.isImportant = isImportant;
    this.linkedUsers = linkedUsers;
    this.linkedTeams = linkedTeams;
    this.linkedSpSites = linkedSpSites;
    this.linkedFiles = linkedFiles;
    this.tags = tags;
  }

  /**
   * Fetches all reminders from user's OneDrive.
   * @param graphClient - the Graph client
   * @private
   */
  public static async getWorkMinders(
    graphClient: MSGraphClientV3,
  ): Promise<WorkMinder[]> {
    console.log("Fetching the reminders");

    // Get the reminders
    const reminders = await graphClient
      .api(`/me/drive/root:/WorkMinders App:/children`)
      .version("v1.0")
      .filter("startswith(name, 'workminder_')")
      .get()
      .catch((error: unknown) => {
        console.error(`_getReminders: ${error}`);
        return;
      });

    // Initialize the array of reminders
    const workMinders: WorkMinder[] = [];

    console.log(reminders.value);

    // Process the reminders
    for (const reminder of reminders.value) {
      const id: number = reminders.value.indexOf(reminder);
      // Get the reminder content
      const reminderContent = await graphClient
        .api(`/me/drive/items/${reminder.id}/content`)
        .version("v1.0")
        .get();

      console.log("pushing reminder with id: " + id);

      workMinders.push(
        new WorkMinder(
          id,
          reminderContent.title,
          reminderContent.description,
          reminderContent.createdDate,
          reminderContent.modifiedDate,
          reminderContent.dueDate,
          reminderContent.isCompleted,
          reminderContent.isImportant,
          reminderContent.linkedUsers,
          reminderContent.linkedTeams,
          reminderContent.linkedSpSites,
          reminderContent.linkedFiles,
          reminderContent.tags,
        ),
      );

      //   ...(reminderContent as WorkMinder),
      //   context: context,
      //   oneDriveId: reminder.id,
      //   localId: id,
      //   createdDate: reminder.createdDateTime,
      //   modifiedDate: reminder.lastModifiedDateTime,
      // } as WorkMinder);
    }

    console.log(workMinders);

    return workMinders;
  }

  /**
   * Update the reminder on OneDrive
   * @param context - the web part context
   * @returns void
   */
  public updateReminder = async (context: WebPartContext): Promise<void> => {
    // Get the graph client
    const graphClient: MSGraphClientV3 =
      await context.msGraphClientFactory.getClient("3");

    // Update the reminder
    const updateResponse = await graphClient
      .api(`/me/drive/items/${Settings.oneDriveFileId}/content`)
      .version("v1.0")
      .headers({
        "Content-Type": "application/json",
      })
      .put({
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        isCompleted: this.isCompleted,
        isImportant: this.isImportant,
        linkedUsers: this.linkedUsers,
        linkedTeams: this.linkedTeams,
        linkedSpSites: this.linkedSpSites,
        linkedFiles: this.linkedFiles,
        tags: this.tags,
      })
      .catch((error: unknown) => {
        console.error(`updateSettings: ${error}`);
      });

    this.modifiedDate = updateResponse.lastModifiedDateTime;
  };

  /**
   * Create a new reminder on OneDrive
   * @param context - the web part context
   * @returns void
   */
  public createReminder = async (context: WebPartContext): Promise<void> => {
    // Get the graph client
    const graphClient: MSGraphClientV3 =
      await context.msGraphClientFactory.getClient("3");

    // Send the reminder
    const creationResponse = await graphClient
      .api(
        `/me/drive/root:/WorkMinders App/workminder_${this.title}_${new Date().toISOString()}.json:/content`,
      )
      .version("v1.0")
      .headers({
        "Content-Type": "application/json",
      })
      .put({
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        isCompleted: this.isCompleted,
        isImportant: this.isImportant,
        linkedUsers: this.linkedUsers,
        linkedTeams: this.linkedTeams,
        linkedSpSites: this.linkedSpSites,
        linkedFiles: this.linkedFiles,
        tags: this.tags,
      })
      .catch((error: unknown) => {
        console.error(`updateSettings: ${error}`);
      });

    this.createdDate = creationResponse.createdDateTime;
    this.modifiedDate = creationResponse.lastModifiedDateTime;
  };
}
