import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Settings } from "../../classes/Settings";
import { TWorkMinder } from "../../types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./DeleteTagOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

interface IDeleteTagOverlayProps {
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  setTagOverlayActive: Dispatch<SetStateAction<boolean>>;
  editedTag: string;
  setEditedTag: Dispatch<SetStateAction<string>>;
  tasks: TWorkMinder[];
}

const DeleteTagOverlay = (props: IDeleteTagOverlayProps): JSX.Element => {
  // HELPER FUNCTIONS --------------------------------------
  /**
   * Returns the title for the overlay.
   * @returns string
   */
  const getOverlayTitle = (): string => {
    return `${strings.delete} ${props.editedTag}?`;
  };

  // EVENT HANDLERS --------------------------------------/
  /**
   * Handles the click event on the delete button.
   */
  const handleDeleteClick = (): void => {
    Settings.deleteTag(props.editedTag, props.tasks);
    props.setTagOverlayActive(false);
    props.setEditedTag("");
    if (props.activeTag === props.editedTag) {
      props.setActiveTag(strings.tasksAll);
    }
  };

  /**
   * Handles the click event on the cancel button.
   */
  const handleCancelClick = (): void => {
    props.setTagOverlayActive(false);
    props.setEditedTag("");
  };

  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={globalStyles.vm_tagOverlayContent}>
        <h2>{getOverlayTitle()}</h2>

        <p className={styles.wm_deleteTagDescription}>
          {strings.tagDeleteDescription}
        </p>

        <div className={globalStyles.wm_footer}>
          <button
            className={globalStyles.wm_rectButton_primary}
            onClick={handleDeleteClick}
          >
            {strings.delete}
          </button>
          <button
            className={globalStyles.wm_rectButton}
            onClick={handleCancelClick}
          >
            {strings.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTagOverlay;
