import * as React from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Add16Regular } from "@fluentui/react-icons";

import TaskList from "./TaskList";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";
import globalStyles from "../GlobalStyles.module.scss";
import { WorkMinder } from "../../classes/WorkMinder";

export interface IContentViewProps {
  webpartContext: WebPartContext;
  activeTag: string;
  tasks: WorkMinder[];
  height: number;
  handleTaskCreation: () => void;
  handleTaskEdit: (task: WorkMinder) => void;
}

const ContentView = (props: IContentViewProps): JSX.Element => {
  return (
    <div
      className={styles.wm_contentView}
      style={{ height: `${props.height}px` }}
    >
      <nav
        className={`${styles.wm_contentNav} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
      >
        <h1 className={styles.vm_contentTitle}>{props.activeTag}</h1>

        <button
          className={globalStyles.wm_rectButton_primary}
          onClick={() => props.handleTaskCreation()}
        >
          <Add16Regular color={"#FFFFFF"} />

          {strings.addTask}
        </button>
      </nav>

      <TaskList tasks={props.tasks} handleTaskEdit={props.handleTaskEdit} />
    </div>
  );
};

export default ContentView;
