import * as React from "react";

import { TWorkMinder } from "../../types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";

export interface IContentViewProps {
  activeTag: string;
  tasks: TWorkMinder[];
}

const ContentView = (props: IContentViewProps): JSX.Element => {
  return (
    <div className={styles.wm_contentView}>
      <header>
        <h1 className={styles.vm_contentTile}>{props.activeTag}</h1>
      </header>

      {!props.tasks.length && (
        <section>
          <div className={styles.vm_contentTile}>
            <h2>{strings.taskListViewNoTasks}</h2>
            <p>{strings.taskListViewNoTasksDescription}</p>
          </div>
        </section>
      )}

      <section>
        {props.tasks.map((task) => (
          <div key={task.localId} className={styles.vm_contentTile}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContentView;
