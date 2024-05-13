import * as React from "react";

import { TWorkMinder } from "../../types/ItemTypes";

import styles from "./TaskItemOverlay.module.scss";

interface ITaskItemOverlayProps {
  task: TWorkMinder;
}

const TaskItemOverlay = (props: ITaskItemOverlayProps): JSX.Element => {
  return (
    <div className={styles.wm_taskItemOverlay}>
      <h2>Task Item Overlay</h2>
    </div>
  );
};

export default TaskItemOverlay;
