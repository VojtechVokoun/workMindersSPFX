import * as React from "react";
import { useEffect } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Spinner } from "@fluentui/react-components";

import { Settings } from "../classes/Settings";
import { WorkMinder } from "../classes/WorkMinder";

import {
  checkOneDriveExistence,
  checkWorkMindersFolder,
} from "../tools/oneDriveUtilities";

import AddEditTagOverlay from "./overlays/AddEditTagOverlay";
import ContentView from "./contentView/ContentView";
import DeleteTagOverlay from "./overlays/DeleteTagOverlay";
import TagChoice from "./tagChoice/TagChoice";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./WorkMinders.module.scss";

export interface IWorkMindersProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  webpartContext: WebPartContext;
  height: number;
}

/**
 * A background component that fetches data from the Graph API, renders the webpart and all its overlays.
 * @param props
 * @constructor
 */
const WorkMinders = (props: IWorkMindersProps): JSX.Element => {
  // COMPONENT STATE --------------------------------------
  /**
   * A state tracking if the OneDrive exists.
   * If the OneDrive does not exist, the value is true.
   */
  const [oneDriveDoesNotExist, setOneDriveDoesNotExist] =
    React.useState<boolean>(false);

  /**
   * A state holding all the tasks fetched from the Graph API.
   * The value is an array of WorkMinder objects.
   */
  const [workMinders, setWorkMinders] = React.useState<WorkMinder[]>([]);

  /**
   * The task edited in the overlay. If the overlay is not active, the value is empty.
   */
  //const [overlayTask, setOverlayTask] =
  //React.useState<TWorkMinder | null>(null);
  /**
   * States tracking the actvity of the tag creation/edit overlay.
   */
  const [tagEditOverlayActive, setTagEditOverlayActive] =
    React.useState<boolean>(false);
  const [tagDeleteOverlayActive, setTagDeleteOverlayActive] =
    React.useState<boolean>(false);
  const [editedTag, setEditedTag] = React.useState<string>("");

  /**
   * The active tag for the task list.
   */
  const [activeTag, setActiveTag] = React.useState<string>(strings.tasksAll);
  /**
   * A state tracking the currently filtered tasks.
   */
  const [filteredTasks, setFilteredTasks] = React.useState<WorkMinder[]>([]);

  /**
   * A state tracking the load state of the webpart.
   */
  const [loaded, setLoaded] = React.useState<boolean>(false);

  // METHODS ----------------------------------------------
  /**
   * Filter the tasks based on the active tag.
   */
  const filterTasks = (): void => {
    let filteredTasks: WorkMinder[];

    // Filter the tasks based on the active tag
    switch (activeTag) {
      case strings.tasksAll:
        filteredTasks = workMinders;
        break;
      case strings.tasksCompleted:
        filteredTasks = workMinders.filter(
          (task: WorkMinder) => task.isCompleted,
        );
        break;
      case strings.tasksOverdue:
        filteredTasks = workMinders.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksUpcoming:
        filteredTasks = workMinders.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) > new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksImportant:
        filteredTasks = workMinders.filter(
          (task: WorkMinder) => task.isImportant,
        );
        break;
      default:
        filteredTasks = workMinders.filter((task: WorkMinder) =>
          task.tags.includes(activeTag),
        );
        break;
    }

    // Sort the tasks by due date
    filteredTasks.sort((a: WorkMinder, b: WorkMinder): number => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return 0;
      }
    });

    // Set the filtered tasks state
    setFilteredTasks(filteredTasks);
  };

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the addition of a tag.
   */
  const handleTagAdd = (): void => {
    setTagEditOverlayActive(true);
  };

  /**
   * Handles the edit of a tag.
   * @param tag - the tag to edit
   */
  const handleTagEdit = (tag: string): void => {
    setTagEditOverlayActive(true);
    setEditedTag(tag);
  };

  /**
   * Handles the deletion of a tag.
   * @param tag - the tag to delete
   */
  const handleTagDelete = (tag: string): void => {
    setTagDeleteOverlayActive(true);
    setEditedTag(tag);
  };

  /**
   * Fetch the data with the Graph API. If the OneDrive does not exist, set the state accordingly.
   * If the data is fetched, set the loaded state to true.
   */
  const getDataFromOneDrive = async (): Promise<void> => {
    const graphClient =
      await props.webpartContext.msGraphClientFactory.getClient("3");

    const oneDriveExists = await checkOneDriveExistence(graphClient);

    if (!oneDriveExists) {
      setOneDriveDoesNotExist(true);
      return;
    }

    await checkWorkMindersFolder(graphClient);

    Settings.getInstance(props.webpartContext);

    const workMinders: WorkMinder[] =
      await WorkMinder.getWorkMinders(graphClient);

    setWorkMinders(workMinders);

    setLoaded(true);
  };

  // LIFECYCLE ---------------------------------------------
  /**
   * Fetch the data from OneDrive.
   */
  useEffect((): void => {
    getDataFromOneDrive().catch((error: unknown) => {
      console.error(`getDataFromOneDrive: ${error}`);
    });
  }, []);

  /**
   * Filter the tasks when the active tag changes and when the tasks change.
   */
  useEffect((): void => {
    filterTasks();
  }, [activeTag, workMinders, Settings.tagList]);

  // STYLES -----------------------------------------------
  /**
   * The dynamic styles for the container. Sets the height of the container based on the set webpart height.
   */
  const containerDynamicStyle: React.CSSProperties = {
    height: props.hasTeamsContext ? "auto" : `${props.height}px`,
  };

  // RENDER -----------------------------------------------
  /**
   * If the OneDrive does not exist, render a message.
   */
  if (oneDriveDoesNotExist) {
    return (
      <div
        className={`${styles.wm_workMindersContainer} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.wm_workMinders_dark : ""} ${styles.wm_fullSizePrompt}`}
        style={containerDynamicStyle}
      >
        <h2>{strings.oneDriveDoesNotExist}</h2>
      </div>
    );
  }

  /**
   * If the data is not yet fetched, render a loading spinner.
   */
  if (!loaded) {
    return (
      <div
        className={`${styles.wm_workMindersContainer} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.wm_workMinders_dark : ""} ${styles.wm_fullSizePrompt}`}
        style={containerDynamicStyle}
      >
        <Spinner
          label={strings.loadingData}
          labelPosition={"below"}
          size={"large"}
        />
      </div>
    );
  }

  /**
   * Render the webpart. If an overlay is active, render it as well (on top of the content).
   */
  return (
    <div
      className={`${styles.wm_workMindersContainer} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.wm_workMinders_dark : ""} ${styles.wm_sidebarContainer}`}
      style={containerDynamicStyle}
    >
      {
        //<div className={styles.wm_screenOverlay} />
      }

      {tagEditOverlayActive && (
        <AddEditTagOverlay
          setTagOverlayActive={setTagEditOverlayActive}
          editedTag={editedTag}
          setEditedTag={setEditedTag}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          tasks={filteredTasks}
        />
      )}

      {tagDeleteOverlayActive && (
        <DeleteTagOverlay
          setTagOverlayActive={setTagDeleteOverlayActive}
          editedTag={editedTag}
          setEditedTag={setEditedTag}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          tasks={filteredTasks}
        />
      )}

      <TagChoice
        userTags={Settings.tagList}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        handleTagAdd={handleTagAdd}
        handleTagEdit={handleTagEdit}
        handleTagDelete={handleTagDelete}
        height={props.height}
      />

      <ContentView
        webpartContext={props.webpartContext}
        activeTag={activeTag}
        tasks={filteredTasks}
        height={props.height}
      />
    </div>
  );
};

export default WorkMinders;
