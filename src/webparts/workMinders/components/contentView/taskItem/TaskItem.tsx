import * as React from "react";

import { TWorkMinder } from "../../../types/ItemTypes";

import styles from "./TaskItem.module.scss";

interface ITaskItemProps {
  task: TWorkMinder;
}

const TaskItem = (props: ITaskItemProps): JSX.Element => {
  return (
    <div className={styles.wm_taskItem}>
      <h2>{props.task.title}</h2>
      <p>{props.task.description}</p>
    </div>
  );
};

export default TaskItem;
