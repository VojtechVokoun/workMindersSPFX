import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Delete16Regular, Edit16Regular } from "@fluentui/react-icons";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TagChoiceItem.module.scss";

interface ITagChoiceItemProps {
  tag: string;
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  handleTagEdit?: (tag: string) => void;
  handleTagDelete?: (tag: string) => void;
}

const TagChoiceItem = (props: ITagChoiceItemProps): JSX.Element => {
  // COMPONENT STATE --------------------------------------
  /**
   * The state tracking the hover state of the list item.
   */
  const [hovered, setHovered] = React.useState<boolean>(false);

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the mouse enter event on the tag list item.
   */
  const handleMouseEnter = (): void => {
    setHovered(true);
  };

  /**
   * Handles the mouse leave event on the tag list item.
   */
  const handleMouseLeave = (): void => {
    setHovered(false);
  };

  /**
   * Handles the click event on the edit button.
   * Passes the tag to the parent component, which will handle the editing.
   * @param event - the click event
   */
  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    if (props.handleTagEdit === undefined) {
      return;
    }
    event.stopPropagation();
    setHovered(false);
    props.handleTagEdit(props.tag);
  };

  /**
   * Handles the click event on the delete button.
   * Passes the tag to the parent component, which will handle the deletion.
   * @param event - the click event
   */
  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    if (props.handleTagDelete === undefined) {
      return;
    }
    event.stopPropagation();
    setHovered(false);
    props.handleTagDelete(props.tag);
  };

  // RENDER -----------------------------------------------
  return (
    <button
      className={
        props.tag === props.activeTag
          ? styles.wm_tagChoiceItemActive
          : styles.wm_tagChoiceItem
      }
      onClick={() => props.setActiveTag(props.tag)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className={styles.wm_tagChoiceItemLabel}>{props.tag}</p>

      {props.handleTagEdit !== undefined &&
        props.handleTagDelete !== undefined &&
        hovered && (
          <div className={styles.wm_tagChoiceItemHoverSection}>
            <button
              className={styles.wm_tagChoiceItemButton}
              onClick={handleEditClick}
              title={strings.edit}
            >
              <Edit16Regular />
            </button>
            <button
              className={styles.wm_tagChoiceItemDeleteButton}
              onClick={handleDeleteClick}
              title={strings.delete}
            >
              <Delete16Regular />
            </button>
          </div>
        )}
    </button>
  );
};

export default TagChoiceItem;
