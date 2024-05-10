import * as React from "react";

import { TWorkMinder } from "../../types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskList.module.scss";
import TaskItem from "./TaskItem";

interface ITaskListProps {
  tasks: TWorkMinder[];
}

const TaskList = (props: ITaskListProps): JSX.Element => {
  return (
    <section className={styles.wm_taskList}>
      {!props.tasks.length && (
        <div className={styles.vm_contentTitle}>
          <h2>{strings.taskListViewNoTasks}</h2>
          <p>{strings.taskListViewNoTasksDescription}</p>
        </div>
      )}

      {props.tasks.map((task: TWorkMinder) => (
        <TaskItem key={task.localId} task={task} />
      ))}
    </section>
  );
};

export default TaskList;
