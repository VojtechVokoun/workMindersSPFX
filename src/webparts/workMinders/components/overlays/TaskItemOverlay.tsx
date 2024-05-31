import * as React from "react";
import { Dispatch, SetStateAction, useState } from "react";

// import { TFile, TSPSite, TTeam, TUser } from "../../types/ItemTypes";
import { WorkMinder } from "../../classes/WorkMinder";

import styles from "./TaskItemOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";

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
  const [dueDateInputValue, setDueDateInputValue] = useState<string>(
    props.task?.dueDate || "",
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

  // RENDER -----------------------------------------------
  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={styles.wm_taskItemOverlay}>
        <h2>Task Item Overlay</h2>

        <label htmlFor={"titleInput"}>TitleXX</label>
        <input
          type={"text"}
          id={"titleInput"}
          value={nameInputValue}
          onChange={(e) => setNameInputValue(e.target.value)}
        />

        <label htmlFor={"descriptionInput"}>DescriptionXX</label>
        <textarea
          id={"descriptionInput"}
          value={descriptionInputValue}
          onChange={(e) => setDescriptionInputValue(e.target.value)}
        />

        <label htmlFor={"dueDateInput"}>Due DateXX</label>
        <input
          type={"date"}
          id={"dueDateInput"}
          value={dueDateInputValue}
          onChange={(e) => setDueDateInputValue(e.target.value)}
        />

        <label htmlFor={"priorityInput"}>PriorityXX</label>
        <input
          type={"checkbox"}
          id={"priorityInput"}
          checked={priorityInputValue}
          onChange={(e) => setPriorityInputValue(e.target.checked)}
        />

        <label htmlFor={"tagsInput"}>TagsXX</label>
        <input
          type={"text"}
          id={"tagsInput"}
          value={tagsInputValue.join(", ")}
          onChange={(e) => setTagsInputValue(e.target.value.split(", "))}
        />
      </div>
    </div>
  );
};

export default TaskItemOverlay;
