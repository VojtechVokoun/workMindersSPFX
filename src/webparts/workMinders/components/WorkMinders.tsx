import * as React from 'react';
import styles from './WorkMinders.module.scss';
import type { IWorkMindersProps } from './IWorkMindersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as React from "react";
import styles from "./WorkMinders.module.scss";
import type { IWorkMindersProps } from "./IWorkMindersProps";

export default class WorkMinders extends React.Component<IWorkMindersProps, {}> {
export default class WorkMinders extends React.Component<IWorkMindersProps> {
  public render(): React.ReactElement<IWorkMindersProps> {
    const { isDarkTheme, hasTeamsContext } = this.props;

    return (
      <section
        className={`${styles.va_welcomeImage} ${hasTeamsContext ? styles.teams : ""}`}
      >
        <div className={styles.va_welcome}>
          nevim vole isDarkTheme: {isDarkTheme ? "true" : "false"}
        </div>
      </section>
    );
  }
}
