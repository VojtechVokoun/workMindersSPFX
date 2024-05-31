import * as React from "react";

import { WorkMinder } from "../../classes/WorkMinder";

import TaskItem from "./taskItem/TaskItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskList.module.scss";

interface ITaskListProps {
  tasks: WorkMinder[];
}

const TaskList = (props: ITaskListProps): JSX.Element => {
  return (
    <section className={styles.wm_taskList}>
      {!props.tasks.length && (
        <div className={styles.vm_noTasks}>
          <h2 className={styles.vm_noTasksTitle}>
            {strings.taskListViewNoTasks}
          </h2>
          <p className={styles.vm_noTasksDescription}>
            {strings.taskListViewNoTasksDescription}
          </p>
        </div>
      )}

      {props.tasks
        .sort((a, b) =>
          a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1,
        )
        .map((task: WorkMinder) => (
          <TaskItem key={task.localId} task={task} />
        ))}
    </section>
  );
};

export default TaskList;
