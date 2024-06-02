/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { Dispatch, SetStateAction, useState } from "react";

import {
  CheckboxChecked24Filled,
  CheckboxUnchecked24Regular,
  ChevronRight20Regular,
  Important20Regular,
  Person16Regular,
} from "@fluentui/react-icons";
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { WorkMinder } from "../../../classes/WorkMinder";

import TagContainer from "./TagContainer";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskItem.module.scss";
import globalStyles from "../../GlobalStyles.module.scss";

// Using require because of SPFx limitations
const imgSharePoint = require("../../../assets/imgs/sharepoint.svg");
const imgTeams = require("../../../assets/imgs/teams.svg");
const imgOneDrive = require("../../../assets/imgs/onedrive.svg");

interface ITaskItemProps {
  task: WorkMinder;
  handleTaskEdit: (task: WorkMinder) => void;
  webpartContext: WebPartContext;
  setAllTasks: Dispatch<SetStateAction<WorkMinder[]>>;
  handleTaskItemCompletionToggle: (task: WorkMinder) => void;
}

const TaskItem = (props: ITaskItemProps): JSX.Element => {
  // LOCAL STATE ------------------------------------------
  /**
   * A state tracking how many times a tag has been dropped.
   * Used to force a re-render. May be used a diagnostic tool.
   */
  const [dropCount, setDropCount] = useState(0);

  // METHODS ----------------------------------------------
  /**
   * Gets yesterday's date.
   * @returns a Date object representing yesterday's date
   */
  const getYesterday = (): Date => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };

  // STYLING ----------------------------------------------
  /**
   * A dynamic styling object for the due date.
   * If the task is overdue and not completed, the color is orange.
   */
  const dueDateDynamicStyle: React.CSSProperties = {
    color:
      props.task.dueDate &&
      new Date(props.task.dueDate) < getYesterday() &&
      !props.task.isCompleted
        ? "#FF7300"
        : "gray",
  };

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the click event on the task item.
   * Toggles the task completion status.
   * @param event - the click event
   */
  const handleTaskItemCompletionClick = (
    event: React.MouseEvent<SVGElement>,
  ): void => {
    event.stopPropagation();

    props.handleTaskItemCompletionToggle(props.task);
  };
  // RENDER -----------------------------------------------
  return (
    <div
      className={`${styles.wm_taskItem} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
      onClick={() => props.handleTaskEdit(props.task)}
      onDrop={(event) => {
        event.preventDefault();

        const data = event.dataTransfer.getData("text/plain");

        if (!props.task.tags.includes(data)) {
          props.task.tags = [...props.task.tags, data].sort((a, b) =>
            a.localeCompare(b),
          );

          props.task.updateReminder(props.webpartContext).catch((error) => {
            console.error(error);
          });

          setDropCount(dropCount + 1);
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
    >
      <div className={styles.wm_taskItemButtonCheckbox}>
        {props.task.isCompleted ? (
          <CheckboxChecked24Filled
            color={"#0078D4"}
            title={strings.taskItemMarkAsIncomplete}
            onClick={handleTaskItemCompletionClick}
          />
        ) : (
          <CheckboxUnchecked24Regular
            color={"#323130"}
            title={strings.taskItemMarkAsComplete}
            onClick={handleTaskItemCompletionClick}
          />
        )}
      </div>

      <div className={styles.wm_taskItemMainSection}>
        <h2 className={styles.wm_taskItemTitle}>{props.task.title}</h2>
        {props.task.description !== "" && (
          <p className={styles.wm_taskItemDescription}>
            {props.task.description}
          </p>
        )}
        {props.task.dueDate !== "" && (
          <p
            className={styles.wm_taskItemDescription}
            style={dueDateDynamicStyle}
          >
            {`${strings.taskItemDueDate}: ${new Date(props.task.dueDate).toLocaleDateString()}`}
          </p>
        )}

        {props.task.tags.length > 0 && <TagContainer tags={props.task.tags} />}

        {props.task.linkedTeams.length > 0 &&
          props.task.linkedUsers.length > 0 &&
          props.task.linkedFiles.length > 0 &&
          props.task.linkedSpSites.length > 0 && (
            <div className={styles.wm_taskItemLinks}>
              {props.task.linkedUsers.length > 0 && (
                <div className={styles.wm_taskItemLinksBadge}>
                  <Person16Regular
                    className={styles.wm_taskItemLinksBadgeIcon}
                    color={"#323130"}
                    title={strings.taskItemLinkedPeople}
                  />

                  <p className={styles.wm_taskItemLinksBadgeText}>
                    {props.task.linkedUsers.length}
                  </p>
                </div>
              )}

              {props.task.linkedTeams.length > 0 && (
                <div className={styles.wm_taskItemLinksBadge}>
                  <img
                    className={styles.wm_taskItemLinksBadgeIcon}
                    src={imgTeams}
                    alt={strings.taskItemLinkedTeams}
                    title={strings.taskItemLinkedTeams}
                  />

                  <p className={styles.wm_taskItemLinksBadgeText}>
                    {props.task.linkedTeams.length}
                  </p>
                </div>
              )}

              {props.task.linkedSpSites.length > 0 && (
                <div className={styles.wm_taskItemLinksBadge}>
                  <img
                    className={styles.wm_taskItemLinksBadgeIcon}
                    src={imgSharePoint}
                    alt={strings.taskItemLinkedSites}
                    title={strings.taskItemLinkedSites}
                  />

                  <p className={styles.wm_taskItemLinksBadgeText}>
                    {props.task.linkedSpSites.length}
                  </p>
                </div>
              )}

              {props.task.linkedFiles.length > 0 && (
                <div className={styles.wm_taskItemLinksBadge}>
                  <img
                    className={styles.wm_taskItemLinksBadgeIcon}
                    src={imgOneDrive}
                    alt={strings.taskItemLinkedFiles}
                    title={strings.taskItemLinkedFiles}
                  />

                  <p className={styles.wm_taskItemLinksBadgeText}>
                    {props.task.linkedFiles.length}
                  </p>
                </div>
              )}
            </div>
          )}
      </div>

      <div className={styles.wm_taskItemButtons}>
        {props.task.isImportant && (
          <Important20Regular
            className={`${styles.wm_taskItemButton} ${styles.wm_taskItemButtonImportant}`}
            title={strings.taskItemImportant}
          />
        )}
        <ChevronRight20Regular className={`${styles.wm_taskItemButton}`} />
      </div>
    </div>
  );
};

export default TaskItem;
