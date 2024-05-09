import * as React from "react";

import { TWorkMinder } from "../../types/ItemTypes";

import styles from "./TaskList.module.scss";

export interface ITaskListProps {
  activeTag: string;
  tasks: TWorkMinder[];
}

const TaskList = (props: ITaskListProps): JSX.Element => {
  return (
    <div className={styles.wm_taskList}>
      <header>
        <h1 className={styles.vm_listTile}>{props.activeTag}</h1>
      </header>
    </div>
  );
};

export default TaskList;
