import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { WebPartContext } from "@microsoft/sp-webpart-base";

import { TFile, TSPSite, TTeam, TUser } from "../../types/ItemTypes";
import { WorkMinder } from "../../classes/WorkMinder";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskItemOverlay.module.scss";
import globalStyles from "../GlobalStyles.module.scss";
import {
  CheckboxChecked24Filled,
  CheckboxUnchecked24Regular,
} from "@fluentui/react-icons";
import {
  getRecentFiles,
  getSites,
  getTeamSuggestions,
  getUserSuggestions,
} from "../../tools/suggestionApiCalls";
import {
  TaskItemOverlayLinkFileTile,
  TaskItemOverlayLinkSpSiteTile,
  TaskItemOverlayLinkTeamTile,
  TaskItemOverlayLinkUserTile,
} from "./taskItemOverlayLinkTiles/TaskItemOverlayLinkTiles";
import TaskItemOverlayTagEditor from "./taskItemOverlayTagEditor/TaskItemOverlayTagEditor";
import { Settings } from "../../classes/Settings";

interface ITaskItemOverlayProps {
  task: WorkMinder | undefined;
  webpartContext: WebPartContext;
  setTaskOverlayActive: Dispatch<SetStateAction<boolean>>;
  setTaskOverlayItem: Dispatch<SetStateAction<WorkMinder | undefined>>;
  allTasks: WorkMinder[];
  setAllTasks: Dispatch<SetStateAction<WorkMinder[]>>;
}

const TaskItemOverlay = (props: ITaskItemOverlayProps): JSX.Element => {
  // STATE ------------------------------------------------
  /**
   * States tracking the input values.
   */
  const [nameInputValue, setNameInputValue] = useState<string>(
    props.task?.title || "",
  );
  const [descriptionInputValue, setDescriptionInputValue] = useState<string>(
    props.task?.description || "",
  );
  const [dueDateInputValue, setDueDateInputValue] = useState<Date>(
    props.task ? new Date(props.task.dueDate) : new Date(),
  );
  const [priorityInputValue, setPriorityInputValue] = useState<boolean>(
    props.task?.isImportant || false,
  );
  const [linkedUsersInputValue, setLinkedUsersInputValue] =
    useState<string>("");
  const [linkedTeamsInputValue, setLinkedTeamsInputValue] =
    useState<string>("");
  const [linkedSpSitesInputValue, setLinkedSpSitesInputValue] =
    useState<string>("");
  const [linkedFilesInputValue, setLinkedFilesInputValue] =
    useState<string>("");
  const [tagsInputValue, setTagsInputValue] = useState<string[]>(
    props.task?.tags || [],
  );

  /**
   * States tracking the linked users, teams, sites and files.
   */
  const [localLinkedUsers, setLocalLinkedUsers] = useState<TUser[]>(
    props.task?.linkedUsers || [],
  );
  const [localLinkedTeams, setLocalLinkedTeams] = useState<TTeam[]>(
    props.task?.linkedTeams || [],
  );
  const [localLinkedSpSites, setLocalLinkedSpSites] = useState<TSPSite[]>(
    props.task?.linkedSpSites || [],
  );
  const [localLinkedFiles, setLocalLinkedFiles] = useState<TFile[]>(
    props.task?.linkedFiles || [],
  );

  /**
   * These states hold all the recent files and SPSites, as they can't be loaded in real time.
   */
  const [recentFiles, setRecentFiles] = useState<TFile[]>([]);
  const [spSites, setSpSites] = useState<TSPSite[]>([]);

  /**
   * These states hold the current suggestions for the linked users, teams, sites and files.
   */
  const [linkedUsersSuggestions, setLinkedUsersSuggestions] = useState<TUser[]>(
    [],
  );
  const [linkedTeamsSuggestions, setLinkedTeamsSuggestions] = useState<TTeam[]>(
    [],
  );
  const [linkedSpSitesSuggestions, setLinkedSpSitesSuggestions] = useState<
    TSPSite[]
  >([]);
  const [linkedFilesSuggestions, setLinkedFilesSuggestions] = useState<TFile[]>(
    [],
  );

  /**
   * This states holds the state of the name input. If it should be highlighted as invalid, it's set to true.
   */
  const [nameInputInvalid, setNameInputInvalid] = useState<boolean>(false);

  // EVENT HANDLERS ---------------------------------------
  /**
   * Handles the click event on the save button.
   */
  const handleSaveClick = (): void => {
    if (nameInputValue === "") {
      setNameInputInvalid(true);
      return;
    }

    let newLocalId = 0;
    if (props.task) {
      // Find the new local ID (the lowest number after all the other tasks)
      newLocalId = Math.max(...props.allTasks.map((task) => task.localId), 0);
    }

    // Create a new task object with the updated properties
    const updatedTask = new WorkMinder(
      props.task ? props.task.localId : newLocalId + 1,
      nameInputValue,
      descriptionInputValue,
      props.task ? props.task.createdDate : new Date().toISOString(),
      new Date().toISOString(),
      dueDateInputValue.toISOString(),
      props.task ? props.task.isCompleted : false,
      priorityInputValue,
      localLinkedUsers,
      localLinkedTeams,
      localLinkedSpSites,
      localLinkedFiles,
      tagsInputValue,
    );

    if (props.task) {
      // Update the properties of the original task object
      props.task.updateProperties(updatedTask);

      // Sync the data with the remote
      props.task.updateReminder(props.webpartContext).catch((error) => {
        console.error("An error occurred: ", error);
      });

      props.setAllTasks((prevState) => {
        // Replace the old task with the updated one
        return prevState.map((checkedTask) =>
          checkedTask.localId === props.task?.localId
            ? props.task
            : checkedTask,
        );
      });
    } else {
      updatedTask.createReminder(props.webpartContext).catch((error) => {
        console.error("An error occurred: ", error);
      });

      props.setAllTasks((prevState) => {
        return [...prevState, updatedTask];
      });
    }

    props.setTaskOverlayActive(false);
    props.setTaskOverlayItem(undefined);
  };

  /**
   * Handles the click event on the cancel button.
   */
  const handleCancelClick = (): void => {
    props.setTaskOverlayActive(false);
    props.setTaskOverlayItem(undefined);
  };

  /**
   * Handles the change of the linked users input.
   * @param event - the change event
   */
  const handleLinkedUsersInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLinkedUsersInputValue(event.target.value);

    // Get the user suggestions
    getUserSuggestions(props.webpartContext, event.target.value)
      .then((users) => {
        setLinkedUsersSuggestions(users);
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
      });
  };

  /**
   * Handles the change of the linked Teams input.
   * @param event - the change event
   */
  const handleLinkedTeamsInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLinkedTeamsInputValue(event.target.value);

    // Get the team suggestions
    getTeamSuggestions(props.webpartContext, event.target.value)
      .then((teams) => {
        setLinkedTeamsSuggestions(teams);
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
      });
  };

  /**
   * Handles the change of the linked SPSites input.
   */
  const handleLinkedSpSitesInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLinkedSpSitesInputValue(event.target.value);

    // Filter the SPSites based on the input value
    if (event.target.value.length < 3) {
      setLinkedSpSitesSuggestions([]);
      return;
    }

    setLinkedSpSitesSuggestions(
      spSites.filter((site) =>
        site.displayName
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      ),
    );
  };

  /**
   * Handles the change of the linked files input.
   */
  const handleLinkedFilesInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLinkedFilesInputValue(event.target.value);

    // Filter the files based on the input value
    if (event.target.value.length < 3) {
      setLinkedFilesSuggestions([]);
      return;
    }

    setLinkedFilesSuggestions(
      recentFiles.filter((file) =>
        file.name.toLowerCase().includes(event.target.value.toLowerCase()),
      ),
    );
  };

  /**
   * Handles the removal of a linked user.
   * @param user - the user to remove
   */
  const handleRemoveLinkedUser = (user: TUser): void => {
    setLocalLinkedUsers(localLinkedUsers.filter((u) => u.id !== user.id));
  };

  /**
   * Handles the removal of a linked team.
   * @param team - the team to remove
   */
  const handleRemoveLinkedTeam = (team: TTeam): void => {
    setLocalLinkedTeams(localLinkedTeams.filter((t) => t.id !== team.id));
  };

  /**
   * Handles the removal of a linked SPSite.
   * @param spSite - the SPSite to remove
   */
  const handleRemoveLinkedSpSite = (spSite: TSPSite): void => {
    setLocalLinkedSpSites(
      localLinkedSpSites.filter((site) => site.id !== spSite.id),
    );
  };

  /**
   * Handles the removal of a linked file.
   * @param file - the file to remove
   */
  const handleRemoveLinkedFile = (file: TFile): void => {
    setLocalLinkedFiles(localLinkedFiles.filter((f) => f.id !== file.id));
  };

  // CONVERSION FUNCTIONS ---------------------------------
  /**
   * Convert a Date object to a string in the format YYYY-MM-DD to use in the date input.
   * @param date - the date to convert
   */
  const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 indexed, so +1 is added
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  /**
   * Convert a string in the format YYYY-MM-DD to a Date object. If the string is empty, return undefined.
   * @param dateString - the string to convert
   */
  const stringToDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  // EFFECTS ----------------------------------------------
  /**
   * When the component mounts, load the recent files and all SPSites, as they can't be loaded in real time.
   */
  useEffect(() => {
    getRecentFiles(props.webpartContext)
      .then((files) => {
        setRecentFiles(files);
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
      });

    getSites(props.webpartContext)
      .then((sites) => {
        setSpSites(sites);
      })
      .catch((error) => {
        console.error("An error occurred: ", error);
      });
  }, []);

  // STYLING ----------------------------------------------
  /**
   * A dynamic styling object for the name input.
   * If the input is invalid, it will be highlighted with a red border.
   */
  const nameInputDynamicStyle: React.CSSProperties = {
    border: nameInputInvalid ? "1px solid #FF0000" : "",
  };

  // RENDER -----------------------------------------------
  return (
    <div className={globalStyles.vm_screenOverlay}>
      <div className={styles.wm_taskItemOverlay}>
        <h2 className={styles.wm_taskItemOverlayTitle}>
          {!props.task ? strings.addTask : strings.editTask}
        </h2>

        <div className={styles.wm_taskItemOverlayContent}>
          <section
            className={styles.wm_taskItemOverlayItemSection}
            title={strings.title}
          >
            <label
              htmlFor={"titleInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.title}
            </label>
            <input
              type={"text"}
              id={"titleInput"}
              className={styles.wm_taskItemOverlayRegularInput}
              style={nameInputDynamicStyle}
              placeholder={strings.titlePlaceholder}
              value={nameInputValue}
              onChange={(e) => {
                setNameInputValue(e.target.value);
                setNameInputInvalid(false);
              }}
              autoFocus={true}
            />
          </section>

          <section
            className={styles.wm_taskItemOverlayItemSection}
            title={strings.description}
          >
            <label
              htmlFor={"descriptionInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.description}
            </label>
            <textarea
              id={"descriptionInput"}
              className={styles.wm_taskItemOverlayTextAreaInput}
              placeholder={strings.descriptionPlaceholder}
              value={descriptionInputValue}
              onChange={(e) => setDescriptionInputValue(e.target.value)}
            />
          </section>

          <section
            className={styles.wm_taskItemOverlayItemHorizontalSection}
            title={`${strings.taskItemDueDate}, ${strings.taskItemImportant}`}
          >
            <div className={styles.wm_taskItemOverlayItemHorizontalDiv}>
              <label
                htmlFor={"dueDateInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemDueDate}
              </label>
              <input
                type={"date"}
                id={"dueDateInput"}
                className={styles.wm_taskItemOverlayRegularInput}
                value={dateToString(dueDateInputValue)}
                onChange={(e) =>
                  setDueDateInputValue(stringToDate(e.target.value))
                }
              />
            </div>

            <div className={styles.wm_taskItemOverlayItemHorizontalDiv}>
              <label
                htmlFor={"priorityInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemImportant}
              </label>
              <div className={styles.wm_taskItemOverlayItemButtonCheckbox}>
                {priorityInputValue ? (
                  <CheckboxChecked24Filled
                    color={"#0078D4"}
                    title={strings.taskItemMarkAsIncomplete}
                    onClick={() => setPriorityInputValue(false)}
                  />
                ) : (
                  <CheckboxUnchecked24Regular
                    color={"#323130"}
                    title={strings.taskItemMarkAsComplete}
                    onClick={() => setPriorityInputValue(true)}
                  />
                )}
              </div>
            </div>
          </section>

          <section
            className={styles.wm_taskItemOverlayItemSection}
            title={strings.tags}
          >
            <label
              htmlFor={"tagsInput"}
              className={styles.wm_taskItemOverlayItemLabel}
            >
              {strings.tags}
            </label>

            <TaskItemOverlayTagEditor
              allAvailableTags={Settings.tagList}
              selectedTags={tagsInputValue}
              setSelectedTags={setTagsInputValue}
            />
          </section>

          <section className={styles.wm_taskItemOverlayLinkStack}>
            <div
              className={styles.wm_taskItemOverlayItemVerticalDiv}
              title={strings.taskItemLinkedPeople}
            >
              <label
                htmlFor={"linkedPeopleInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemLinkedPeople}
              </label>

              {localLinkedUsers.map((user) => (
                <TaskItemOverlayLinkUserTile
                  key={user.id}
                  user={user}
                  handleRemoveLinkedUser={handleRemoveLinkedUser}
                />
              ))}

              <input
                type={"text"}
                id={"linkedPeopleInput"}
                className={styles.wm_taskItemOverlayRegularInput}
                placeholder={strings.addMore}
                value={linkedUsersInputValue}
                onChange={handleLinkedUsersInputChange}
              />

              {linkedUsersSuggestions.length > 0 && (
                <div className={styles.wm_taskItemOverlaySuggestionDropdown}>
                  {linkedUsersSuggestions.map((user) => (
                    <div
                      key={user.id}
                      className={
                        styles.wm_taskItemOverlaySuggestionDropdownItem
                      }
                      onClick={() => {
                        setLocalLinkedUsers((prevUsers) => [
                          ...prevUsers,
                          user,
                        ]);
                        setLinkedUsersInputValue("");
                        setLinkedUsersSuggestions([]);
                      }}
                    >
                      {user.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.wm_taskItemOverlayItemVerticalDiv}
              title={strings.taskItemLinkedTeams}
            >
              <label
                htmlFor={"linkedTeamsInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemLinkedTeams}
              </label>

              {localLinkedTeams.map((team) => (
                <TaskItemOverlayLinkTeamTile
                  key={team.id}
                  team={team}
                  handleRemoveLinkedTeam={handleRemoveLinkedTeam}
                />
              ))}

              <input
                type={"text"}
                id={"linkedTeamsInput"}
                className={styles.wm_taskItemOverlayRegularInput}
                placeholder={strings.addMore}
                value={linkedTeamsInputValue}
                onChange={handleLinkedTeamsInputChange}
              />

              {linkedTeamsSuggestions.length > 0 && (
                <div className={styles.wm_taskItemOverlaySuggestionDropdown}>
                  {linkedTeamsSuggestions.map((team) => (
                    <div
                      key={team.id}
                      className={
                        styles.wm_taskItemOverlaySuggestionDropdownItem
                      }
                      onClick={() => {
                        setLocalLinkedTeams((prevTeams) => [
                          ...prevTeams,
                          team,
                        ]);
                        setLinkedTeamsInputValue("");
                        setLinkedTeamsSuggestions([]);
                      }}
                    >
                      {team.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.wm_taskItemOverlayItemVerticalDiv}
              title={strings.taskItemLinkedSites}
            >
              <label
                htmlFor={"linkedSitesInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemLinkedSites}
              </label>

              {localLinkedSpSites.map((site) => (
                <TaskItemOverlayLinkSpSiteTile
                  key={site.id}
                  spSite={site}
                  handleRemoveLinkedSpSite={handleRemoveLinkedSpSite}
                />
              ))}

              <input
                type={"text"}
                id={"linkedSitesInput"}
                className={styles.wm_taskItemOverlayRegularInput}
                placeholder={strings.addMore}
                value={linkedSpSitesInputValue}
                onChange={handleLinkedSpSitesInputChange}
              />

              {linkedSpSitesSuggestions.length > 0 && (
                <div className={styles.wm_taskItemOverlaySuggestionDropdown}>
                  {linkedSpSitesSuggestions.map((site) => (
                    <div
                      key={site.id}
                      className={
                        styles.wm_taskItemOverlaySuggestionDropdownItem
                      }
                      onClick={() => {
                        setLocalLinkedSpSites((prevSites) => [
                          ...prevSites,
                          site,
                        ]);
                        setLinkedSpSitesInputValue("");
                        setLinkedTeamsSuggestions([]);
                      }}
                    >
                      {site.displayName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.wm_taskItemOverlayItemVerticalDiv}
              title={strings.taskItemLinkedFiles}
            >
              <label
                htmlFor={"linkedFilesInput"}
                className={styles.wm_taskItemOverlayItemLabel}
              >
                {strings.taskItemLinkedFiles}
              </label>

              {localLinkedFiles.map((file) => (
                <TaskItemOverlayLinkFileTile
                  key={file.id}
                  file={file}
                  handleRemoveLinkedFile={handleRemoveLinkedFile}
                />
              ))}

              <input
                type={"text"}
                id={"linkedFilesInput"}
                className={styles.wm_taskItemOverlayRegularInput}
                placeholder={strings.addMore}
                value={linkedFilesInputValue}
                onChange={handleLinkedFilesInputChange}
              />

              {linkedFilesSuggestions.length > 0 && (
                <div className={styles.wm_taskItemOverlaySuggestionDropdown}>
                  {linkedFilesSuggestions.map((file) => (
                    <div
                      key={file.id}
                      className={
                        styles.wm_taskItemOverlaySuggestionDropdownItem
                      }
                      onClick={() => {
                        setLocalLinkedFiles((prevFiles) => [
                          ...prevFiles,
                          file,
                        ]);
                        setLinkedFilesInputValue("");
                        setLinkedFilesSuggestions([]);
                      }}
                    >
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <footer
          className={`${globalStyles.wm_footer} ${styles.wm_taskItemOverlayFooter}`}
        >
          <button
            className={globalStyles.wm_rectButton_primary}
            onClick={handleSaveClick}
            style={{ opacity: nameInputValue === "" ? 0.5 : 1 }}
          >
            {strings.save}
          </button>
          <button
            className={globalStyles.wm_rectButton}
            onClick={handleCancelClick}
          >
            {strings.discard}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TaskItemOverlay;
