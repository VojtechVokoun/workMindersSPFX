import * as React from "react";
import { useEffect } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

import { Settings } from "../classes/Settings";
import { TWorkMinder } from "../types/ItemTypes";

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
  workMinders: TWorkMinder[];
  height: number;
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
  const [filteredTasks, setFilteredTasks] = React.useState<TWorkMinder[]>([]);

  // METHODS ----------------------------------------------
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
        filteredTasks = props.workMinders.filter(
          (task: TWorkMinder) => task.isCompleted,
        );
        break;
      case strings.tasksOverdue:
        filteredTasks = props.workMinders.filter(
          (task: TWorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksUpcoming:
        filteredTasks = props.workMinders.filter(
          (task: TWorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) > new Date() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksImportant:
        filteredTasks = props.workMinders.filter(
          (task: TWorkMinder) => task.isImportant,
        );
        break;
      default:
        filteredTasks = props.workMinders.filter((task: TWorkMinder) =>
          task.tags.includes(activeTag),
        );
        break;
    }

    // Sort the tasks by due date
    filteredTasks.sort((a: TWorkMinder, b: TWorkMinder): number => {
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
    //const newTags: string[] = props.settings.tagList.filter((t) => t !== tag);
    //props.settings.tagList = newTags;
    //props.settings.save();
    //if (tag === activeTag) {
    //setActiveTag(strings.tasksAll);
    //}
  };

  /**
   * Filter the tasks when the active tag changes and when the tasks change.
   */
  useEffect((): void => {
    filterTasks();
  }, [activeTag, props.workMinders, Settings.tagList]);

  // STYLES -----------------------------------------------
  const containerDynamicStyle: React.CSSProperties = {
    height: props.height,
  };

  // RENDER -----------------------------------------------
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
