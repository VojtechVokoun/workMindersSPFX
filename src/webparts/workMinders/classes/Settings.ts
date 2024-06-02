import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { WorkMinder } from "./WorkMinder";

export class Settings {
  // Technical stuff
  public static context: WebPartContext;
  public static oneDriveFileId: string;

  // User properties
  public static tagList: string[];

  // Instance of the Settings class
  static instance: Settings;

  /**
   * Initialize the settings.
   * @param context - the web part context
   */
  constructor(context: WebPartContext) {
    Settings.context = context;
    Settings.tagList = [];
    Settings.oneDriveFileId = "";
    Settings.getSettings().catch((error: unknown) => {
      console.error(`Settings: ${error}`);
    });
  }

  /**
   * Get the instance of the Settings class.
   * @param context
   */
  public static getInstance(context: WebPartContext): Settings {
    // If instance not available, create a new one
    if (!Settings.instance) {
      Settings.instance = new Settings(context);
    }

    // Return the instance
    return Settings.instance;
  }

  /**
   * Edit the tag, replacing it in all tasks and updating the settings.
   * @param oldTag - the old tag name
   * @param newTag - the new tag name
   * @param tasks - the tasks to update
   * @param context - the web part context
   */
  public static editTag(
    oldTag: string,
    newTag: string,
    tasks: WorkMinder[],
    context: WebPartContext,
  ): void {
    if (Settings.tagList.includes(oldTag)) {
      Settings.tagList[Settings.tagList.indexOf(oldTag)] = newTag;
    }

    this.replaceTagInTasks(oldTag, newTag, tasks, context);
    this.syncWithRemote().catch((error: unknown) => {
      console.error(`editTag: ${error}`);
    });
  }

  /**
   * Delete the tag, replacing it in all tasks and updating the settings.
   * @param tag - the tag name
   * @param tasks - the tasks to update
   * @param context - the web part context
   */
  public static deleteTag(
    tag: string,
    tasks: WorkMinder[],
    context: WebPartContext,
  ): void {
    if (Settings.tagList.includes(tag)) {
      Settings.tagList.splice(Settings.tagList.indexOf(tag), 1);
    }

    this.replaceTagInTasks(tag, "", tasks, context);
    this.syncWithRemote().catch((error: unknown) => {
      console.error(`deleteTag: ${error}`);
    });
  }

  /**
   * Add the tag and update the settings.
   * @param tag - the tag name
   */
  public static addTag(tag: string): void {
    if (!Settings.tagList.includes(tag)) {
      Settings.tagList.push(tag);
    }

    this.syncWithRemote().catch((error: unknown) => {
      console.error(`addTag: ${error}`);
    });
  }

  /**
   * Replace the old tag with the new tag in all tasks.
   * @param oldTag - the old tag name
   * @param newTag - the new tag name
   * @param tasks - the tasks to update
   * @param context - the web part context
   * @private
   */
  private static replaceTagInTasks(
    oldTag: string,
    newTag: string,
    tasks: WorkMinder[],
    context: WebPartContext,
  ): void {
    tasks.forEach((task) => {
      if (task.tags.includes(oldTag)) {
        if (newTag === "") {
          task.tags.splice(task.tags.indexOf(oldTag), 1);
        } else {
          task.tags[task.tags.indexOf(oldTag)] = newTag;
        }
      }

      task.updateReminder(context).catch((error: unknown) => {
        console.error(`replaceTagInTasks: ${error}`);
      });
    });
  }

  /**
   * Synchronize the settings with the remote.
   * @private
   */
  private static async syncWithRemote(): Promise<void> {
    // Get the graph client
    const graphClient: MSGraphClientV3 =
      await this.context.msGraphClientFactory.getClient("3");

    // Update the settings
    await graphClient
      .api(`/me/drive/items/${this.oneDriveFileId}/content`)
      .version("v1.0")
      .headers({
        "Content-Type": "application/json",
      })
      .put({
        tagList: this.tagList,
      })
      .catch((error: unknown) => {
        console.error(`updateSettings: ${error}`);
      });
  }

  /**
   * Get the settings from the remote.
   * @private
   */
  private static async getSettings(): Promise<void> {
    // Get the graph client
    const graphClient: MSGraphClientV3 =
      await this.context.msGraphClientFactory.getClient("3");

    // Get the settings file ID
    const settingsFileMetadata = await graphClient
      .api(`/me/drive/root:/WorkMinders App/_appSettings.json`)
      .version("v1.0")
      .get()
      .catch((error: unknown) => {
        console.error(`_getSettings: ${error}`);
        return;
      });

    // If the settings file does not exist, create it
    if (!settingsFileMetadata) {
      await this.createSettingsFileOneDrive();
      return;
    }

    this.oneDriveFileId = settingsFileMetadata.id;

    // Get the settings file
    const settingsFile = await graphClient
      .api(`/me/drive/root:/WorkMinders App/_appSettings.json:/content`)
      .version("v1.0")
      .get()
      .catch((error: unknown) => {
        console.error(`_getSettings: ${error}`);
        return;
      });

    // Set the settings
    this.tagList = settingsFile.tagList;

    this.tagList = this.tagList.filter((tag, index, self) => {
      return self.indexOf(tag) === index && tag !== "";
    });

    return;
  }

  /**
   * Create the settings file on OneDrive.
   * @private
   */
  private static async createSettingsFileOneDrive(): Promise<void> {
    console.log("Creating the '_appSettings.json' file");

    // Get the graph client
    const graphClient: MSGraphClientV3 =
      await this.context.msGraphClientFactory.getClient("3");

    // Create the settings file
    const creationResponse = await graphClient
      .api("/me/drive/root:/WorkMinders App/_appSettings.json:/content")
      .version("v1.0")
      .headers({
        "Content-Type": "application/json",
      })
      .put({
        tagList: [],
      })
      .catch((error: unknown) => {
        console.error(`_getSettings: ${error}`);
      });

    // Set the OneDrive ID
    this.oneDriveFileId = creationResponse.id;

    return;
  }
}
