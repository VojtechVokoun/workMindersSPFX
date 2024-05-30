import * as React from "react";

import styles from "./TaskItemOverlay.module.scss";
import { WorkMinder } from "../../classes/WorkMinder";

interface ITaskItemOverlayProps {
  task: WorkMinder;
}

const TaskItemOverlay = (props: ITaskItemOverlayProps): JSX.Element => {
  return (
    <div className={styles.wm_taskItemOverlay}>
      <h2>Task Item Overlay</h2>
    </div>
  );
};

export default TaskItemOverlay;
