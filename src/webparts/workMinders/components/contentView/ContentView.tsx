import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Add16Regular, ChevronRight20Regular } from "@fluentui/react-icons";

import { WorkMinder } from "../../classes/WorkMinder";

import TaskList from "./TaskList";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./ContentView.module.scss";
import globalStyles from "../GlobalStyles.module.scss";

export interface IContentViewProps {
  webpartContext: WebPartContext;
  allTasks: WorkMinder[];
  activeTag: string;
  height: number;
  handleTaskCreation: () => void;
  handleTaskEdit: (task: WorkMinder) => void;
  setSidebarActive: Dispatch<SetStateAction<boolean>>;
  hasTeamsContext: boolean;
  setAllTasks: Dispatch<SetStateAction<WorkMinder[]>>;
}

const ContentView = (props: IContentViewProps): JSX.Element => {
  // STATE -------------------------------------------------
  /**
   * This holds the hover state of the add button.
   */
  const [addButtonHover, setAddButtonHover] = React.useState(false);

  // EVENT HANDLERS ----------------------------------------
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

  // STYLES -----------------------------------------------
  /**
   * The dynamic styles for the container. Sets the height of the container based on the set webpart height.
   */
  const containerDynamicStyle: React.CSSProperties = {
    height: props.hasTeamsContext ? "100%" : `${props.height}px`,
  };

  // RENDER ------------------------------------------------
  return (
    <div className={styles.wm_contentView} style={containerDynamicStyle}>
      <nav
        className={`${styles.wm_contentNav} ${globalStyles.wm_contentViewItemHorizontalPadding}`}
      >
        <div className={styles.wm_contentTitleMobileNav}>
          <ChevronRight20Regular
            className={`${globalStyles.showOnMobile} ${styles.wm_sidebarOpen}`}
            onClick={() => props.setSidebarActive(true)}
          />

          <h1 className={styles.vm_contentTitle}>{props.activeTag}</h1>
        </div>

        <button
          className={globalStyles.wm_rectButton_primary}
          onClick={() => props.handleTaskCreation()}
          onPointerEnter={handleAddButtonPointerEnter}
          onPointerLeave={handleAddButtonPointerLeave}
        >
          <Add16Regular
            color={"#FFFFFF"}
            style={{
              transform: addButtonHover ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          />

          {strings.addTask}
        </button>
      </nav>

      <TaskList
        allTasks={props.allTasks}
        activeTag={props.activeTag}
        handleTaskEdit={props.handleTaskEdit}
        webpartContext={props.webpartContext}
        setAllTasks={props.setAllTasks}
      />
    </div>
  );
};

export default ContentView;
