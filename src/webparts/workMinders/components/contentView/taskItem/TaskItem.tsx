import * as React from "react";

import {
  CheckboxChecked24Filled,
  CheckboxUnchecked24Regular,
  ChevronRight20Regular,
  Important20Regular,
} from "@fluentui/react-icons";

import { TWorkMinder } from "../../../types/ItemTypes";

import TagContainer from "./TagContainer";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskItem.module.scss";
import globalStyles from "../../GlobalStyles.module.scss";

interface ITaskItemProps {
  task: TWorkMinder;
}

const TaskItem = (props: ITaskItemProps): JSX.Element => {
  // LOCAL STATE ------------------------------------------
  /**
   * The state tracking the completion status of the task.
   */
  const [isCompleted, setIsCompleted] = React.useState<boolean>(
    props.task.isCompleted,
  );

  // STYLING ----------------------------------------------
  /**
   * A dynamic styling object for the due date.
   */
  const dueDateDynamicStyle: React.CSSProperties = {
    color: props.task.dueDate > new Date().toISOString() ? "#FF0000" : "gray",
  };

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the click event on the task item.
   * Toggles the task completion status.
   * @param event - the click event
   */
  const handleTaskItemCompletionClick = (
    event: React.MouseEvent<SVGElement>,
  ): void => {
    event.stopPropagation();
    props.task.isCompleted = !props.task.isCompleted;
    setIsCompleted(props.task.isCompleted);
  };

  // RENDER -----------------------------------------------
  return (
    <div
      className={`${styles.wm_taskItem} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
    >
      {isCompleted ? (
        <CheckboxChecked24Filled
          className={styles.wm_taskItemButtonCheckbox}
          color={"#0078D4"}
          title={strings.taskItemMarkAsIncomplete}
          onClick={handleTaskItemCompletionClick}
        />
      ) : (
        <CheckboxUnchecked24Regular
          className={styles.wm_taskItemButtonCheckbox}
          color={"#323130"}
          title={strings.taskItemMarkAsComplete}
          onClick={handleTaskItemCompletionClick}
        />
      )}

      <div className={styles.wm_taskItemMainSection}>
        <h2 className={styles.wm_taskItemTitle}>{props.task.title}</h2>
        <p className={styles.wm_taskItemDescription}>
          {props.task.description}
        </p>
        {props.task.dueDate !== "" && (
          <p
            className={styles.wm_taskItemDescription}
            style={dueDateDynamicStyle}
          >
            Due: {props.task.dueDate.toLocaleLowerCase()}
          </p>
        )}

        <TagContainer tags={props.task.tags} />
      </div>

      <div className={styles.wm_taskItemButtons}>
        {props.task.isImportant && (
          <Important20Regular
            className={`${styles.wm_taskItemButton} ${styles.wm_taskItemButtonImportant}`}
            title={strings.taskItemImportant}
          />
        )}
        <ChevronRight20Regular className={`${styles.wm_taskItemButton}`} />
      </div>
    </div>
  );
};

export default TaskItem;
