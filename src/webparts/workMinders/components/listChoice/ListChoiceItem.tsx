import * as React from "react";

import styles from "./ListChoiceItem.module.scss";
import { Dispatch, SetStateAction } from "react";

interface IListChoiceItemProps {
  tag: string;
  activeTag: string;
  setActiveTag: Dispatch<SetStateAction<string>>;
}

const ListChoiceItem = (props: IListChoiceItemProps): JSX.Element => {
  return (
    <button
      className={
        props.tag === props.activeTag
          ? styles.wm_listChoiceItemActive
          : styles.wm_listChoiceItem
      }
      onClick={() => props.setActiveTag(props.tag)}
    >
      <p className={styles.wm_listChoiceItemLabel}>{props.tag}</p>
    </button>
  );
};

export default ListChoiceItem;
