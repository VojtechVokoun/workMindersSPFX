import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Settings } from "../../classes/Settings";
import { TWorkMinder } from "../../types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./AddEditTagOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

interface IAddEditTagOverlayProps {
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  editedTag: string;
  setEditedTag: Dispatch<SetStateAction<string>>;
  setTagOverlayActive: Dispatch<SetStateAction<boolean>>;
  tasks: TWorkMinder[];
}

const AddEditTagOverlay = (props: IAddEditTagOverlayProps): JSX.Element => {
  // COMPONENT STATE --------------------------------------
  /**
   * The state tracking the input value.
   */
  const [inputValue, setInputValue] = React.useState<string>(props.editedTag);

  // HELPER FUNCTIONS --------------------------------------
  /**
   * Returns the title for the overlay.
   * @returns string
   */
  const getOverlayTitle = (): string => {
    if (props.editedTag === "") {
      return strings.addTag;
    }
    return `${strings.edit} ${props.editedTag}`;
  };

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the change event on the input field.
   * @param event - the change event
   */
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setInputValue(event.target.value);
  };

  /**
   * Handles the click event on the save button.
   */
  const handleSaveClick = (): void => {
    if (props.editedTag === "") {
      Settings.addTag(inputValue);
    } else {
      Settings.editTag(props.editedTag, inputValue, props.tasks);
      props.setEditedTag("");
    }
    if (inputValue === props.activeTag) {
      props.setActiveTag(inputValue);
    }
    props.setTagOverlayActive(false);
  };

  /**
   * Handles the click event on the cancel button.
   */
  const handleCancelClick = (): void => {
    if (props.editedTag !== "") {
      props.setEditedTag("");
    }
    props.setTagOverlayActive(false);
  };

  // RENDER -----------------------------------------------
  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={globalStyles.vm_tagOverlayContent}>
        <h2>{getOverlayTitle()}</h2>

        <input
          type="text"
          className={globalStyles.wm_borderedInput}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={
            props.editedTag === ""
              ? strings.addTagPlaceholder
              : strings.editTagPlaceholder
          }
        />

        <p className={styles.wm_tagOverlayHint}>{strings.tagHint}</p>

        <div className={globalStyles.wm_footer}>
          <button
            className={globalStyles.wm_rectButton_primary}
            onClick={handleSaveClick}
          >
            {strings.done}
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

export default AddEditTagOverlay;
