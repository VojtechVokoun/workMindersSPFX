import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Add20Regular } from "@fluentui/react-icons";

import ListChoiceItem from "./ListChoiceItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ListChoice.module.scss";

export interface IListChoiceProps {
  userTags: string[];
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
  height: number;
}

/**
 * The sidebar section containing the tag choice.
 * @param props - component properties
 * @constructor
 */
const ListChoice = (props: IListChoiceProps): JSX.Element => {
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

  // ICON GETTER ------------------------------------------
  /**
   * Gets an
   */

  // RENDER -----------------------------------------------
  return (
    <div
      className={styles.wm_listChoice}
      style={{ height: `${props.height}px` }}
    >
      <section className={styles.wm_tagSection}>
        {defaultTags.map((tag) => (
          <ListChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
          />
        ))}

        <div className={styles.wm_tagSectionTitle}>
          <h3 className={styles.wm_tagSectionTitleText}>{strings.tags}</h3>

          <Add20Regular />
        </div>

        {sortUserTags().map((tag) => (
          <ListChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
          />
        ))}
      </section>
    </div>
  );
};

export default ListChoice;
