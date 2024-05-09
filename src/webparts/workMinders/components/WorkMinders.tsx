import * as React from "react";
import { useEffect } from "react";

import { MSGraphClientV3 } from "@microsoft/sp-http";

import {
  //getManager,
  getSites,
  getTeamSuggestions,
  getUserSuggestions,
  getRecentFiles,
} from "../tools/suggestionApiCalls";
import { TSettings, TWorkMinder } from "../types/ItemTypes";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./WorkMinders.module.scss";
import ListChoice from "./mainLayout/ListChoice";
import TaskList from "./mainLayout/TaskList";

export interface IWorkMindersProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  webpartContext: WebPartContext;
  settings: TSettings;
  workMinders: TWorkMinder[];
  height: number;
  smallUi: boolean;
  oneDriveDoesNotExist: boolean;
}

/**
 * A background component that fetches data from the Graph API, renders the webpart and all its overlays.
 * @param props
 * @constructor
 */
const WorkMinders = (props: IWorkMindersProps): JSX.Element => {
  // COMPONENT STATE --------------------------------------
  /**
   * The task edited in the overlay. If the overlay is not active, the value is empty.
   */
  //const [overlayTask, setOverlayTask] =
  //React.useState<TWorkMinder | null>(null);
  /**
   * The active tag for the task list.
   */
  const [activeTag, setActiveTag] = React.useState<string>(strings.tasksAll);

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
    setActiveTag(strings.tasksAll); // TODO: remove this line after implementation
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
      className={`${styles.wm_workMindersContainer} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.wm_workMinders_dark : ""} ${!props.smallUi ? styles.wm_sidebarContainer : ""}`}
      style={containerStyle}
    >
      {
        //<div className={styles.wm_screenOverlay} />
      }

      <ListChoice
        userTags={props.settings.tagList}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
      />

      <TaskList activeTag={activeTag} tasks={[]} />
    </div>
  );
};

export default WorkMinders;
