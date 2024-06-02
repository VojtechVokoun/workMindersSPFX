import * as React from "react";

import {
  CheckboxChecked24Filled,
  CheckboxUnchecked24Regular,
  ChevronDown16Regular,
  Search16Regular,
} from "@fluentui/react-icons";

import styles from "./TaskItemOverlayTagEditor.module.scss";
import { useState } from "react";
import * as strings from "WorkMindersWebPartStrings";

interface ITaskItemOverlayTagEditorProps {
  allAvailableTags: string[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TaskItemOverlayTagEditorMainButton = (props: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTags: string[];
}): JSX.Element => {
  // FUNCTIONS --------------------------------------------
  /**
   * Gets the text for the primary filter label.
   * @param selectedDepartments The selected departments.
   * @returns The text for the primary filter label.
   */
  const getLabelText = (selectedDepartments: string[]): string => {
    if (selectedDepartments.length === 0) {
      return strings.noTags;
    } else if (selectedDepartments.length === 1) {
      return selectedDepartments[0];
    } else {
      return `${props.selectedTags.join(", ")}`;
    }
  };

  // STYLES -----------------------------------------------
  /**
   * Sets the border color of the view.
   */
  const viewStyle: React.CSSProperties = {
    border: `1px solid ${props.isExpanded ? "#0078D4" : "gray"}`,
  };

  // RENDER -----------------------------------------------
  return (
    <div
      className={styles.wm_tagEditorView}
      style={viewStyle}
      onClick={() => props.setIsExpanded(!props.isExpanded)}
    >
      <p className={styles.wm_tagEditorLabel}>
        {getLabelText(props.selectedTags)}
      </p>

      <ChevronDown16Regular
        className={styles.wm_tagEditorIcon}
        onClick={() => props.setIsExpanded(!props.isExpanded)}
        style={{
          transform: props.isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease-in-out",
        }}
      />
    </div>
  );
};

const PrimaryFilterExpandedItem = (props: {
  tag: string;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}): JSX.Element => {
  const [isSelected, setIsSelected] = React.useState<boolean>(
    props.selectedTags.includes(props.tag),
  );

  // RENDER -----------------------------------------------
  return (
    <div className={styles.wm_tagEditorSingleTagContainer}>
      <div
        className={styles.wm_tagEditorSingleTagCheckbox}
        onClick={() => {
          if (!isSelected) {
            const newTags = [...props.selectedTags];

            newTags.push(props.tag);

            newTags.sort((a, b) => a.localeCompare(b));

            props.setSelectedTags(newTags);
          } else {
            props.setSelectedTags(
              props.selectedTags.filter(
                (department) => department !== props.tag,
              ),
            );
          }
          setIsSelected(!isSelected);
        }}
      >
        {isSelected ? (
          <CheckboxChecked24Filled color={"#0078D4"} />
        ) : (
          <CheckboxUnchecked24Regular color={"#323130"} />
        )}
      </div>

      <p className={styles.wm_tagEditorSingleTagTitle}>{props.tag}</p>
    </div>
  );
};

const PrimaryFilterExpandedList = (props: {
  allAvailableDepartments: string[];
  selectedDepartments: string[];
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
}): JSX.Element => {
  // STATE ------------------------------------------------
  /**
   * Filter text input.
   */
  const [filterText, setFilterText] = React.useState("");

  // RENDER -----------------------------------------------
  return (
    <div className={styles.wm_tagEditorExpandedContainer}>
      <div className={styles.wm_tagEditorExpandedSearch}>
        <Search16Regular className={styles.wm_tagEditorExpandedSearchIcon} />

        <input
          className={styles.wm_tagEditorExpandedSearchInput}
          placeholder={strings.searchTags}
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />
      </div>

      {props.allAvailableDepartments
        .filter((department) =>
          department.toLowerCase().includes(filterText.toLowerCase()),
        )
        .map((department, key) => (
          <PrimaryFilterExpandedItem
            key={key}
            tag={department}
            selectedTags={props.selectedDepartments}
            setSelectedTags={props.setSelectedDepartments}
          />
        ))}
    </div>
  );
};

const TaskItemOverlayTagEditor = (
  props: ITaskItemOverlayTagEditorProps,
): JSX.Element => {
  // STATE -----------------------------------------------
  /**
   * Whether the primary filter is expanded or not.
   */
  const [isExpanded, setIsExpanded] = useState(false);

  // RENDER -----------------------------------------------
  // if (isExpanded) {
  return (
    <>
      {isExpanded && (
        <div style={{ position: "relative" }}>
          <div className={styles.primaryFilterStackerContainer}>
            <TaskItemOverlayTagEditorMainButton
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              selectedTags={props.selectedTags}
            />

            <PrimaryFilterExpandedList
              allAvailableDepartments={props.allAvailableTags}
              selectedDepartments={props.selectedTags}
              setSelectedDepartments={props.setSelectedTags}
            />
          </div>
        </div>
      )}

      <TaskItemOverlayTagEditorMainButton
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        selectedTags={props.selectedTags}
      />
    </>
  );
  // }
};

export default TaskItemOverlayTagEditor;
