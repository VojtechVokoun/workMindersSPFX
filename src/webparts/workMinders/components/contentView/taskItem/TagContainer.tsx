import * as React from "react";

import styles from "./TagContainer.module.scss";

interface ITagContainerProps {
  tags: string[];
}

const TagContainer = (props: ITagContainerProps): JSX.Element => {
  return (
    <div className={styles.wm_tagContainer}>
      {props.tags.map((tag: string) => (
        <span key={tag} className={styles.wm_tagItem}>
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagContainer;
