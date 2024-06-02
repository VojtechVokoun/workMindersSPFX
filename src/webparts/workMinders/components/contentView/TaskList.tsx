import * as React from "react";
import { Dispatch, SetStateAction, useState } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

import { WorkMinder } from "../../classes/WorkMinder";

import TaskItem from "./taskItem/TaskItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskList.module.scss";

interface ITaskListProps {
  allTasks: WorkMinder[];
  setAllTasks: Dispatch<SetStateAction<WorkMinder[]>>;
  activeTag: string;
  handleTaskEdit: (task: WorkMinder) => void;
  webpartContext: WebPartContext;
}

const TaskList = (props: ITaskListProps): JSX.Element => {
  // STATE ------------------------------------------------
  /**
   * A state tracking the currently filtered tasks.
   */
  const [filteredTasks, setFilteredTasks] = useState<WorkMinder[]>([]);

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
    switch (props.activeTag) {
      case strings.tasksAll:
        filteredTasks = props.allTasks.filter(
          (task: WorkMinder) => !task.isCompleted,
        );
        break;
      case strings.tasksCompleted:
        filteredTasks = props.allTasks.filter(
          (task: WorkMinder) => task.isCompleted,
        );
        break;
      case strings.tasksOverdue:
        filteredTasks = props.allTasks.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) < getYesterday() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksUpcoming:
        filteredTasks = props.allTasks.filter(
          (task: WorkMinder) =>
            task.dueDate &&
            new Date(task.dueDate) > getYesterday() &&
            !task.isCompleted,
        );
        break;
      case strings.tasksImportant:
        filteredTasks = props.allTasks.filter(
          (task: WorkMinder) => task.isImportant && !task.isCompleted,
        );
        break;
      default:
        filteredTasks = props.allTasks.filter((task: WorkMinder) =>
          task.tags.includes(props.activeTag),
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

  // EFFECTS ----------------------------------------------
  /**
   * Filter the tasks when the active tag or all tasks change.
   */
  React.useEffect(() => {
    filterTasks();
  }, [props.activeTag, props.allTasks]);

  // EVENT HANDLERS ---------------------------------------
  /**
   * An event handler that toggles the task completion status.
   * @param task - the task to toggle
   */
  const handleTaskItemCompletionToggle = (task: WorkMinder): void => {
    // Toggle the isCompleted property of the task
    task.isCompleted = !task.isCompleted;

    // Sync the data with the remote

    task.updateReminder(props.webpartContext).catch((error) => {
      console.error(error);
    });

    // Update the allTasks state
    props.setAllTasks((prevTasks) =>
      prevTasks.map((t) => (t.localId === task.localId ? task : t)),
    );
  };

  // RENDER -----------------------------------------------
  return (
    <section className={styles.wm_taskList}>
      {!filteredTasks.length && (
        <div className={styles.vm_noTasks}>
          <h2 className={styles.vm_noTasksTitle}>
            {strings.taskListViewNoTasks}
          </h2>
          <p className={styles.vm_noTasksDescription}>
            {strings.taskListViewNoTasksDescription}
          </p>
        </div>
      )}

      {filteredTasks.map((task: WorkMinder) => (
        <TaskItem
          key={task.localId}
          task={task}
          handleTaskEdit={props.handleTaskEdit}
          webpartContext={props.webpartContext}
          setAllTasks={props.setAllTasks}
          handleTaskItemCompletionToggle={handleTaskItemCompletionToggle}
        />
      ))}
    </section>
  );
};

export default TaskList;
