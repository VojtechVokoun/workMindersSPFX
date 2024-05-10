import * as React from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Add16Regular } from "@fluentui/react-icons";

import { createReminder } from "../../tools/reminderSenders";
import { TWorkMinder } from "../../types/ItemTypes";

import TaskList from "./TaskList";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";

export interface IContentViewProps {
  webpartContext: WebPartContext;
  activeTag: string;
  tasks: TWorkMinder[];
}

const ContentView = (props: IContentViewProps): JSX.Element => {
  return (
    <div className={styles.wm_contentView}>
      <header>
        <h1 className={styles.vm_contentTile}>{props.activeTag}</h1>
      </header>

      <TaskList tasks={props.tasks} />

      <section className={styles.wm_contentBottom}>
        <button
          className={styles.wm_addButton}
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
      </section>
    </div>
  );
};

export default ContentView;
