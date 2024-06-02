import * as React from "react";
import { useEffect, useState } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Spinner } from "@fluentui/react-components";

import { Settings } from "../classes/Settings";
import { WorkMinder } from "../classes/WorkMinder";

import {
  checkOneDriveExistence,
  checkWorkMindersFolder,
} from "../tools/oneDriveUtilities";
import {
  getViewportDimensions,
  TViewportDimensions,
} from "../tools/windowDimensions";

import AddEditTagOverlay from "./overlays/AddEditTagOverlay";
import ContentView from "./contentView/ContentView";
import DeleteTagOverlay from "./overlays/DeleteTagOverlay";
import TagChoice from "./tagChoice/TagChoice";
import TaskItemOverlay from "./overlays/TaskItemOverlay";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./WorkMinders.module.scss";
import globalStyles from "./GlobalStyles.module.scss";

export interface IWorkMindersProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  webpartContext: WebPartContext;
  height: number;
}

/**
 * A background component that fetches data from the Graph API, renders the webpart and all its overlays.
 * @param props - the component properties
 */
const WorkMinders = (props: IWorkMindersProps): JSX.Element => {
  // COMPONENT STATE --------------------------------------
  /**
   * A state tracking if the OneDrive exists.
   * If the OneDrive does not exist, the value is true.
   */
  const [oneDriveDoesNotExist, setOneDriveDoesNotExist] =
    useState<boolean>(false);

  /**
   * A state holding all the tasks fetched from the Graph API.
   * The value is an array of WorkMinder objects.
   */
  const [allWorkMinders, setAllWorkMinders] = useState<WorkMinder[]>([]);

  /**
   * States tracking the actvity of the task creation/edit overlay.
   */
  const [taskOverlayActive, setTaskOverlayActive] = useState<boolean>(false);
  const [taskOverlayItem, setTaskOverlayItem] = useState<
    WorkMinder | undefined
  >(undefined);
  /**
   * States tracking the actvity of the tag creation/edit overlay.
   */
  const [tagEditOverlayActive, setTagEditOverlayActive] =
    useState<boolean>(false);
  const [tagDeleteOverlayActive, setTagDeleteOverlayActive] =
    useState<boolean>(false);
  const [editedTag, setEditedTag] = useState<string>("");

  /**
   * The active tag for the task list.
   */
  const [activeTag, setActiveTag] = useState<string>(strings.tasksAll);
  /**
   * A state tracking the currently filtered tasks.
   */
  const [filteredTasks, setFilteredTasks] = useState<WorkMinder[]>([]);

  /**
   * A state tracking the load state of the webpart.
   */
  const [loaded, setLoaded] = useState<boolean>(false);

  /**
   * Hook responsible for storing the current viewport dimensions.
   */
  const [viewportDimensions, setViewportDimensions] =
    useState<TViewportDimensions>(getViewportDimensions());

  /**
   * A state holding the activity of the sidebar. Only applies to mobile viewports.
   */
  const [sidebarActive, setSidebarActive] = useState<boolean>(false);

  /**
   * A state tracking the number of completed tasks.
   * Used to force a re-filter and re-sort when a task is marked as complete.
   */
  const [completeCount, setCompleteCount] = useState<number>(0);

  // METHODS ----------------------------------------------
  /**
   * Gets yesterday's date.
   * @returns a Date object representing yesterday's date
   */
  const getYesterday = (): Date => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };

  /**
   * Filter the tasks based on the active tag.
   */
  const filterTasks = (): void => {
    let filteredTasks: WorkMinder[];

    // Filter the tasks based on the active tag
    switch (activeTag) {
      case strings.tasksAll:
        filteredTasks = allWorkMinders;
        break;
      case strings.tasksCompleted:
        filteredTasks = allWorkMinders.filter(
          (task: WorkMinder) => task.isCompleted,
        );
        break;
      case strings.tasksOverdue:
        filteredTasks = allWorkMinders.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) < getYesterday() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksUpcoming:
        filteredTasks = allWorkMinders.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) > new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksImportant:
        filteredTasks = allWorkMinders.filter(
          (task: WorkMinder) => task.isImportant,
        );
        break;
      default:
        filteredTasks = allWorkMinders.filter((task: WorkMinder) =>
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

  const handleTaskCreation = (): void => {
    setTaskOverlayActive(true);
    setTaskOverlayItem(undefined);
  };

  const handleTaskEdit = (task: WorkMinder): void => {
    setTaskOverlayActive(true);
    setTaskOverlayItem(task);
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

    const fetchedWorkMinders: WorkMinder[] =
      await WorkMinder.getWorkMinders(graphClient);

    setAllWorkMinders(fetchedWorkMinders);

    setLoaded(true);
  };

  // LIFECYCLE ---------------------------------------------
  /**
   * Event listener for the window resize event. Updates the viewport dimensions.
   */
  useEffect(() => {
    /*
      Function to handle the resize event
      ! Intentionally only in the scope of this hook.
    */
    function handleResize(): void {
      setViewportDimensions(getViewportDimensions());
    }

    // Add listener
    window.addEventListener("resize", handleResize);

    // Remove listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, [activeTag, allWorkMinders, Settings.tagList, completeCount]);

  // STYLES -----------------------------------------------
  /**
   * The dynamic styles for the container. Sets the height of the container based on the set webpart height.
   */
  const containerDynamicStyle: React.CSSProperties = {
    height: props.hasTeamsContext ? "100%" : `${props.height}px`,
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
   * Render the webpart content. If an overlay is active, render it as well (on top of the content).
   */
  return (
    <div
      className={`${styles.wm_workMindersContainer} ${props.hasTeamsContext ? styles.teams : ""} ${props.isDarkTheme ? styles.wm_workMinders_dark : ""} ${styles.wm_sidebarContainer}`}
      style={containerDynamicStyle}
    >
      {taskOverlayActive && (
        <TaskItemOverlay
          task={taskOverlayItem}
          webpartContext={props.webpartContext}
          setTaskOverlayActive={setTaskOverlayActive}
          setTaskOverlayItem={setTaskOverlayItem}
          setAllTasks={setAllWorkMinders}
        />
      )}

      {tagEditOverlayActive && (
        <AddEditTagOverlay
          setTagOverlayActive={setTagEditOverlayActive}
          editedTag={editedTag}
          setEditedTag={setEditedTag}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          tasks={filteredTasks}
          webpartContext={props.webpartContext}
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
          webpartContext={props.webpartContext}
        />
      )}

      <div className={globalStyles.hideOnMobile}>
        <TagChoice
          userTags={Settings.tagList}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          handleTagAdd={handleTagAdd}
          handleTagEdit={handleTagEdit}
          handleTagDelete={handleTagDelete}
          height={props.height}
          setSidebarActive={setSidebarActive}
        />
      </div>

      {viewportDimensions.viewportWidth <= 1024 && sidebarActive && (
        <TagChoice
          userTags={Settings.tagList}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          handleTagAdd={handleTagAdd}
          handleTagEdit={handleTagEdit}
          handleTagDelete={handleTagDelete}
          height={props.height}
          setSidebarActive={setSidebarActive}
        />
      )}

      {!(viewportDimensions.viewportWidth <= 1024 && sidebarActive) && (
        <ContentView
          webpartContext={props.webpartContext}
          activeTag={activeTag}
          tasks={filteredTasks}
          height={props.height}
          handleTaskCreation={handleTaskCreation}
          handleTaskEdit={handleTaskEdit}
          setSidebarActive={setSidebarActive}
          setCompleteCount={setCompleteCount}
        />
      )}
    </div>
  );
};

export default WorkMinders;
