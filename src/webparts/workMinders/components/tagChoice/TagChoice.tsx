import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Add20Regular, Dismiss20Regular } from "@fluentui/react-icons";

import TagChoiceItem from "./TagChoiceItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TagChoice.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

export interface ITagChoiceProps {
  userTags: string[];
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  handleTagAdd: () => void;
  handleTagEdit: (tag: string) => void;
  handleTagDelete: (tag: string) => void;
  height: number;
  setSidebarActive: Dispatch<SetStateAction<boolean>>;
}

/**
 * The sidebar section containing the tag choice.
 * @param props - component properties
 * @constructor
 */
const TagChoice = (props: ITagChoiceProps): JSX.Element => {
  // STATE ------------------------------------------------
  /**
   * This holds the hover state of the add button.
   */
  const [addButtonHover, setAddButtonHover] = React.useState(false);

  // HELPER LIST ------------------------------------------
  /**
   * List of default tags.
   */
  const defaultTags: string[] = [
    strings.tasksAll,
    strings.tasksCompleted,
    strings.tasksOverdue,
    strings.tasksUpcoming,
    strings.tasksImportant,
  ];

  // SORTING ----------------------------------------------
  /**
   * Sorts the user tags alphabetically.
   * @returns string[]
   */
  const sortUserTags = (): string[] => {
    return props.userTags.sort((a, b) => a.localeCompare(b));
  };

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the click event on the add button.
   * Passes the tag to the parent component, which will handle the editing.
   */
  const handleAddClick = (): void => {
    props.handleTagAdd();
  };

  /**
   * Handles the pointer enter event on the add button.
   */
  const handleAddButtonPointerEnter = (): void => {
    setAddButtonHover(true);
  };

  /**
   * Handles the pointer leave event on the add button.
   */
  const handleAddButtonPointerLeave = (): void => {
    setAddButtonHover(false);
  };

  // RENDER -----------------------------------------------
  return (
    <div
      className={styles.wm_tagChoice}
      style={{ height: `${props.height}px` }}
    >
      <section className={globalStyles.showOnMobile}>
        <Dismiss20Regular
          className={styles.wm_sidebarDismiss}
          onClick={() => props.setSidebarActive(false)}
        />
      </section>

      <section className={styles.wm_tagSection}>
        {defaultTags.map((tag: string) => (
          <TagChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
          />
        ))}

        <div className={styles.wm_tagSectionTitle}>
          <h3 className={styles.wm_tagSectionTitleText}>{strings.tags}</h3>

          <Add20Regular
            title={strings.addTag}
            onClick={handleAddClick}
            onPointerEnter={handleAddButtonPointerEnter}
            onPointerLeave={handleAddButtonPointerLeave}
            cursor={"pointer"}
            style={{
              transform: addButtonHover ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />
        </div>

        {sortUserTags().map((tag: string) => (
          <TagChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
            handleTagEdit={props.handleTagEdit}
            handleTagDelete={props.handleTagDelete}
          />
        ))}

        {sortUserTags().length === 0 && (
          <p className={styles.wm_tagSectionInfo}>{strings.noTags + "..."}</p>
        )}
      </section>
    </div>
  );
};

export default TagChoice;
