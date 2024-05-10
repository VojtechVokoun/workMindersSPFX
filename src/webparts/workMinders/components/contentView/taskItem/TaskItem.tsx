import * as React from "react";

import { TWorkMinder } from "../../../types/ItemTypes";

import styles from "./TaskItem.module.scss";
import globalStyles from "../../GlobalStyles.module.scss";
import TagContainer from "./TagContainer";

interface ITaskItemProps {
  task: TWorkMinder;
}

const TaskItem = (props: ITaskItemProps): JSX.Element => {
  return (
    <div
      className={`${styles.wm_taskItem} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
    >
      <div className={styles.wm_taskItemMainSection}>
        <h2>{props.task.title}</h2>
        <p>{props.task.description}</p>
        <TagContainer tags={props.task.tags} />
      </div>
    </div>
  );
};

export default TaskItem;
