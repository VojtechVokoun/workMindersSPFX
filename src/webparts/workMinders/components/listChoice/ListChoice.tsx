import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Add16Regular } from "@fluentui/react-icons";

import ListChoiceItem from "./ListChoiceItem";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ListChoice.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

export interface IListChoiceProps {
  userTags: string[];
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
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

  // ICON GETTER ------------------------------------------
  /**
   * Gets an
   */

  // RENDER -----------------------------------------------
  return (
    <div className={styles.wm_listChoice}>
      <section>
        {defaultTags.map((tag) => (
          <ListChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
          />
        ))}

        <h3 className={styles.wm_tagSectionTitle}>{strings.tags}</h3>

        {props.userTags.map((tag) => (
          <ListChoiceItem
            key={tag}
            tag={tag}
            activeTag={props.activeTag}
            setActiveTag={props.setActiveTag}
          />
        ))}
      </section>

      <section className={globalStyles.wm_contentFooter}>
        <button className={globalStyles.wm_rectButton}>
          <Add16Regular />

          {strings.addTask}
        </button>
      </section>
    </div>
  );
};

export default ListChoice;
