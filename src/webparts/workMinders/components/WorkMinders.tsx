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
import ListChoice from "./listChoice/ListChoice";
import ContentView from "./contentView/ContentView";

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
   * A state tracking the currently filtered tasks.
   */
  const [filteredTasks, setFilteredTasks] = React.useState<TWorkMinder[]>([]);

  // METHODS ----------------------------------------------
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

  /**
   * Filter the tasks based on the active tag.
   */
  const filterTasks = (): void => {
    let filteredTasks: TWorkMinder[];

    // Filter the tasks based on the active tag
    switch (activeTag) {
      case strings.tasksAll:
        filteredTasks = props.workMinders;
        break;
      case strings.tasksCompleted:
        filteredTasks = props.workMinders.filter((task) => task.isCompleted);
        break;
      case strings.tasksOverdue:
        filteredTasks = props.workMinders.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksUpcoming:
        filteredTasks = props.workMinders.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) > new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksImportant:
        filteredTasks = props.workMinders.filter((task) => task.isImportant);
        break;
      default:
        filteredTasks = props.workMinders.filter((task) =>
          task.tags.includes(activeTag),
        );
        break;
    }

    // Sort the tasks by due date
    filteredTasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return 0;
      }
    });

    // Set the filtered tasks state
    setFilteredTasks(filteredTasks);
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

  /**
   * Filter the tasks when the active tag changes and when the tasks change.
   */
  useEffect(() => {
    filterTasks();
  }, [activeTag, props.workMinders]);

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

      <ContentView
        webpartContext={props.webpartContext}
        activeTag={activeTag}
        tasks={filteredTasks}
      />
    </div>
  );
};

export default WorkMinders;
