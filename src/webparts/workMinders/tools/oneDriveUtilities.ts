import { MSGraphClientV3 } from "@microsoft/sp-http";

/**
 * Check if the user has a OneDrive.
 * @param graphClient - the Microsoft Graph client
 * @returns true if the user has a OneDrive, false if not
 */
export const checkOneDriveExistence = async (
  graphClient: MSGraphClientV3,
): Promise<boolean> => {
  const oneDrive = await graphClient
    .api("/me/drive")
    .version("v1.0")
    .get()
    .catch((error: unknown) => {
      console.error(`_getReminders: ${error}`);
      return;
    });

  return !!oneDrive;
};

/**
 * Check if the WorkMinders folder exists in the user's OneDrive.
 * If it does not exist, create it.
 * @param graphClient - the Microsoft Graph client
 */
export const checkWorkMindersFolder = async (
  graphClient: MSGraphClientV3,
): Promise<void> => {
  // See if the 'WorkMinders App' folder exists, if not, create it
  // Get the 'WorkMinders App' folder
  const workMindersFolder = await graphClient
    .api(`/me/drive/root/children`)
    .version("v1.0")
    .filter("name eq 'WorkMinders App'")
    .get()
    .catch((error: unknown) => {
      console.error(`_getReminders: ${error}`);
      return;
    });

  // If the folder doesn't exist, create it and return
  if (!workMindersFolder.value.length) {
    console.log("Creating the 'WorkMinders App' folder");

    await graphClient
      .api("/me/drive/root/children")
      .version("v1.0")
      .post({
        name: "WorkMinders App",
        folder: {},
      })
      .catch((error: unknown) => {
        console.error(`_getReminders: ${error}`);
      });

    return;
  }
};
