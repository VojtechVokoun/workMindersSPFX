import * as React from "react";
import { Dispatch, SetStateAction, useState } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

// import { TFile, TSPSite, TTeam, TUser } from "../../types/ItemTypes";
import { WorkMinder } from "../../classes/WorkMinder";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskItemOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

interface ITaskItemOverlayProps {
  task: WorkMinder | undefined;
  webpartContext: WebPartContext;
  setTaskOverlayActive: Dispatch<SetStateAction<boolean>>;
  setTaskOverlayItem: Dispatch<SetStateAction<WorkMinder | undefined>>;
}

const TaskItemOverlay = (props: ITaskItemOverlayProps): JSX.Element => {
  // STATE ------------------------------------------------
  /**
   * States tracking the input values.
   */
  const [nameInputValue, setNameInputValue] = useState<string>(
    props.task?.title || "",
  );
  const [descriptionInputValue, setDescriptionInputValue] = useState<string>(
    props.task?.description || "",
  );
  const [dueDateInputValue, setDueDateInputValue] = useState<Date | undefined>(
    props.task ? new Date(props.task.dueDate) : undefined,
  );
  const [priorityInputValue, setPriorityInputValue] = useState<boolean>(
    props.task?.isImportant || false,
  );
  // const [linkedUsersInputValue, setLinkedUsersInputValue] = useState<TUser[]>(
  //   props.task?.linkedUsers || [],
  // );
  // const [linkedTeamsInputValue, setLinkedTeamsInputValue] = useState<TTeam[]>(
  //   props.task?.linkedTeams || [],
  // );
  // const [linkedSpSitesInputValue, setLinkedSpSitesInputValue] = useState<
  //   TSPSite[]
  // >(props.task?.linkedSpSites || []);
  // const [linkedFilesInputValue, setLinkedFilesInputValue] = useState<TFile[]>(
  //   props.task?.linkedFiles || [],
  // );
  const [tagsInputValue, setTagsInputValue] = useState<string[]>(
    props.task?.tags || [],
  );

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the click event on the save button.
   */
  const handleSaveClick = (): void => {
    if (nameInputValue === "") {
      return;
    }

    if (props.task) {
      props.task.title = nameInputValue;
      props.task.description = descriptionInputValue;
      props.task.dueDate = dueDateInputValue?.toISOString() || "";
      props.task.isImportant = priorityInputValue;
      props.task.tags = tagsInputValue;
    } else {
      const newTask = new WorkMinder(
        0,
        nameInputValue,
        descriptionInputValue,
        new Date().toISOString(),
        new Date().toISOString(),
        dueDateInputValue?.toISOString() || "",
        false,
        priorityInputValue,
        [],
        [],
        [],
        [],
        tagsInputValue,
      );
      console.log(newTask);
    }

    props.setTaskOverlayActive(false);
    props.setTaskOverlayItem(undefined);
  };

  /**
   * Handles the click event on the cancel button.
   */
  const handleCancelClick = (): void => {
    props.setTaskOverlayActive(false);
    props.setTaskOverlayItem(undefined);
  };

  // CONVERSION FUNCTIONS ---------------------------------
  /**
   * Convert a Date object to a string in the format YYYY-MM-DD to use in the date input.
   * @param date - the date to convert
   */
  const dateToString = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 indexed, so +1 is added
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /**
   * Convert a string in the format YYYY-MM-DD to a Date object. If the string is empty, return undefined.
   * @param dateString - the string to convert
   */
  const stringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };

  // RENDER -----------------------------------------------
  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={styles.wm_taskItemOverlay}>
        <h2 className={styles.wm_taskItemOverlayTitle}>
          {!props.task ? strings.addTask : strings.editTask}
        </h2>

        <div className={styles.wm_taskItemOverlayContent}>
          <section className={styles.wm_taskItemOverlayItemSection}>
            <label
              htmlFor={"titleInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              TitleXX
            </label>
            <input
              type={"text"}
              id={"titleInput"}
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
            />
          </section>

          <section className={styles.wm_taskItemOverlayItemSection}>
            <label
              htmlFor={"descriptionInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              DescriptionXX
            </label>
            <textarea
              id={"descriptionInput"}
              value={descriptionInputValue}
              onChange={(e) => setDescriptionInputValue(e.target.value)}
            />
          </section>

          <section className={styles.wm_taskItemOverlayItemSection}>
            <label
              htmlFor={"dueDateInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.taskItemDueDate}
            </label>
            <input
              type={"date"}
              id={"dueDateInput"}
              value={dateToString(dueDateInputValue)}
              onChange={(e) =>
                setDueDateInputValue(stringToDate(e.target.value))
              }
            />
          </section>

          <section className={styles.wm_taskItemOverlayItemSection}>
            <label
              htmlFor={"priorityInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.taskItemImportant}
            </label>
            <input
              type={"checkbox"}
              id={"priorityInput"}
              checked={priorityInputValue}
              onChange={(e) => setPriorityInputValue(e.target.checked)}
            />
          </section>

          <section className={styles.wm_taskItemOverlayItemSection}>
            <label
              htmlFor={"tagsInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.tags}
            </label>
            <input
              type={"text"}
              id={"tagsInput"}
              value={tagsInputValue.join(", ")}
              onChange={(e) => setTagsInputValue(e.target.value.split(", "))}
            />
          </section>
        </div>

        <footer
          className={`${globalStyles.wm_footer} ${styles.wm_taskItemOverlayFooter}`}
        >
          <button
            className={globalStyles.wm_rectButton_primary}
            onClick={handleSaveClick}
            //style={{ opacity: inputValue === "" ? 0.5 : 1 }}
          >
            {strings.done}
          </button>
          <button
            className={globalStyles.wm_rectButton}
            onClick={handleCancelClick}
          >
            {strings.cancel}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TaskItemOverlay;
