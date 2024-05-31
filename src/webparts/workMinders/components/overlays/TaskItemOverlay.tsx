import * as React from "react";
import { useState } from "react";

import { TFile, TSPSite, TTeam, TUser } from "../../types/ItemTypes";
import { WorkMinder } from "../../classes/WorkMinder";

import styles from "./TaskItemOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

interface ITaskItemOverlayProps {
  task: WorkMinder | undefined;
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
  const [linkedUsersInputValue, setLinkedUsersInputValue] = useState<TUser[]>(
    props.task?.linkedUsers || [],
  );
  const [linkedTeamsInputValue, setLinkedTeamsInputValue] = useState<TTeam[]>(
    props.task?.linkedTeams || [],
  );
  const [linkedSpSitesInputValue, setLinkedSpSitesInputValue] = useState<
    TSPSite[]
  >(props.task?.linkedSpSites || []);
  const [linkedFilesInputValue, setLinkedFilesInputValue] = useState<TFile[]>(
    props.task?.linkedFiles || [],
  );
  const [tagsInputValue, setTagsInputValue] = useState<string[]>(
    props.task?.tags || [],
  );

  // RENDER -----------------------------------------------
  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={styles.wm_taskItemOverlay}>
        <h2>Task Item Overlay</h2>
      </div>
    </div>
  );
};

export default TaskItemOverlay;
