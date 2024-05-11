import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Add20Regular } from "@fluentui/react-icons";

import TagChoiceItem from "./TagChoiceItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TagChoice.module.scss";

export interface ITagChoiceProps {
  userTags: string[];
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  handleTagAdd: () => void;
  handleTagEdit: (tag: string) => void;
  handleTagDelete: (tag: string) => void;
  height: number;
}

/**
 * The sidebar section containing the tag choice.
 * @param props - component properties
 * @constructor
 */
const TagChoice = (props: ITagChoiceProps): JSX.Element => {
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

  // RENDER -----------------------------------------------
  return (
    <div
      className={styles.wm_tagChoice}
      style={{ height: `${props.height}px` }}
    >
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
            cursor={"pointer"}
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
      </section>
    </div>
  );
};

export default TagChoice;
