import * as React from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Add16Regular } from "@fluentui/react-icons";

import { createReminder } from "../../tools/reminderSenders";
import { TWorkMinder } from "../../types/ItemTypes";

import TaskList from "./TaskList";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

export interface IContentViewProps {
  webpartContext: WebPartContext;
  activeTag: string;
  tasks: TWorkMinder[];
  height: number;
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
          onClick={() =>
            createReminder(props.webpartContext, {
              localId: 0,
              oneDriveId: "",
              title: "Test WorkMinder",
              description: "Testing the WorkMinder creation process.",
              createdDate: "",
              modifiedDate: "",
              dueDate: "",
              isCompleted: false,
              isImportant: true,
              linkedUsers: [],
              linkedTeams: [],
              linkedSpSites: [],
              linkedFiles: [],
              tags: ["pr1"],
            } as TWorkMinder)
          }
        >
          <Add16Regular color={"#FFFFFF"} />

          {strings.addTask}
        </button>
      </nav>

      <TaskList tasks={props.tasks} />
    </div>
  );
};

export default ContentView;
