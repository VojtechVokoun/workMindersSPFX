import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Add16Regular, ChevronRight20Regular } from "@fluentui/react-icons";

import { WorkMinder } from "../../classes/WorkMinder";

import TaskList from "./TaskList";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

export interface IContentViewProps {
  webpartContext: WebPartContext;
  activeTag: string;
  tasks: WorkMinder[];
  height: number;
  handleTaskCreation: () => void;
  handleTaskEdit: (task: WorkMinder) => void;
  setSidebarActive: Dispatch<SetStateAction<boolean>>;
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
        <div className={styles.wm_contentTitleMobileNav}>
          <ChevronRight20Regular
            className={`${globalStyles.showOnMobile} ${styles.wm_sidebarOpen}`}
            onClick={() => props.setSidebarActive(true)}
          />

          <h1 className={styles.vm_contentTitle}>{props.activeTag}</h1>
        </div>

        <button
          className={globalStyles.wm_rectButton_primary}
          onClick={() => props.handleTaskCreation()}
        >
          <Add16Regular color={"#FFFFFF"} />

          {strings.addTask}
        </button>
      </nav>

      <TaskList
        tasks={props.tasks}
        handleTaskEdit={props.handleTaskEdit}
        webpartContext={props.webpartContext}
      />
    </div>
  );
};

export default ContentView;
