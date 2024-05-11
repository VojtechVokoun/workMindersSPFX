import * as React from "react";

import {
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
  // STYLING ----------------------------------------------
  /**
   * A dynamic styling object for the due date.
   */
  const dueDateDynamicStyle: React.CSSProperties = {
    color: props.task.dueDate > new Date().toISOString() ? "#FF0000" : "gray",
  };

  // RENDER -----------------------------------------------
  return (
    <div
      className={`${styles.wm_taskItem} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
    >
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
