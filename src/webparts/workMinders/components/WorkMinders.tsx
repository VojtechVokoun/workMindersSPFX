import * as React from "react";
import { useEffect } from "react";
import styles from "./WorkMinders.module.scss";
import type { IWorkMindersProps } from "./IWorkMindersProps";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import {
  //getManager,
  getSites,
  getTeamSuggestions,
  getUserSuggestions,
  getRecentFiles,
} from "../tools/suggestionApiCalls";

/**
 * A background component that fetches data from the Graph API, renders the webpart and all its overlays.
 * @param props
 * @constructor
 */
const WorkMinders = (props: IWorkMindersProps): JSX.Element => {
  //const [overlayActive, setOverlayActive] = React.useState<boolean>(true);

  /**
   * ! Test function
   * Fetch all the data from the Graph API.
   * @returns void
   */
  const getAll = async (): Promise<void> => {
    // Generate the hraph client
    const graphClient: MSGraphClientV3 =
      await props.webpartContext.msGraphClientFactory.getClient("3");
    //console.log("Manager:");
    //await getManager(graphClient);
    console.log("Team suggestions:");
    await getTeamSuggestions(graphClient, "Coe");
    console.log("User suggestions:");
    await getUserSuggestions(graphClient, "Vojt");
    console.log("Sites:");
    await getSites(props.webpartContext);
    console.log("Files:");
    await getRecentFiles(graphClient);
  };

  // EFFECTS ----------------------------------------------
  /**
   * Fetch the data from the Graph API when the component is mounted.
   */
  useEffect(() => {
    getAll().catch((error) => {
      console.error("Error in useEffect: ", error);
    });
  }, []);

  // STYLES -----------------------------------------------
  const containerStyle = {
    height: props.height,
  };

  // RENDER -----------------------------------------------
  /**
   * Render the webpart. If an overlay is active, render it as well (on top of the content).
   */
  return (
    <div
      className={`${styles.va_workMinders} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.va_workMinders_dark : ""}`}
      style={containerStyle}
    >
      {
        //<div className={styles.va_screenOverlay} />
      }

      <div>nevim vole isDarkTheme: {props.isDarkTheme ? "true" : "false"}</div>
      <div>
        onedrive does not exist: {props.oneDriveDoesNotExist ? "true" : "false"}
      </div>
    </div>
  );
};

export default WorkMinders;
