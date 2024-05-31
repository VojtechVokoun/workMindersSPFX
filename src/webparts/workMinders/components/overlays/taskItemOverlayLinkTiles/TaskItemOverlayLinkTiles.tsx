/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";

import {
  Copy20Regular,
  Dismiss20Regular,
  Person24Regular,
} from "@fluentui/react-icons";

import { TFile, TSPSite, TUser, TTeam } from "../../../types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";
import styles from "./TaskItemOverlayLinkTiles.module.scss";

// Using require because of SPFx limitations
const imgSharePoint = require("../../../assets/imgs/sharepoint.svg");
const imgTeams = require("../../../assets/imgs/teams.svg");
const imgOneDrive = require("../../../assets/imgs/onedrive.svg");

interface ITaskItemOverlayLinkUserTileProps {
  user: TUser;
  handleRemoveLinkedUser: (user: TUser) => void;
}

interface ITaskItemOverlayLinkTeamTileProps {
  team: TTeam;
  handleRemoveLinkedTeam: (team: TTeam) => void;
}

interface ITaskItemOverlayLinkSpSiteTileProps {
  spSite: TSPSite;
  handleRemoveLinkedSpSite: (spSite: TSPSite) => void;
}

interface ITaskItemOverlayLinkFileTileProps {
  file: TFile;
  handleRemoveLinkedFile: (file: TFile) => void;
}

const handleTileClick = (url: string): void => {
  window.open(url, "_blank");
};

const handleCopyClick = (url: string): void => {
  navigator.clipboard.writeText(url).catch((error) => {
    console.error(`handleCopyClick: ${error}`);
  });
};

export const TaskItemOverlayLinkUserTile = (
  props: ITaskItemOverlayLinkUserTileProps,
): JSX.Element => {
  const redirectUrl: string = `https://teams.microsoft.com/l/chat/0/0?users=${props.user.mail}`;

  return (
    <div
      onClick={() => handleTileClick(redirectUrl)}
      className={styles.wm_linkTile}
    >
      <Person24Regular
        className={styles.wm_linkTileIcon}
        color={"#323130"}
        title={strings.taskItemLinkedPeople}
      />

      <div className={styles.wm_linkTileText}>{props.user.displayName}</div>

      {props.user.mail && (
        <Copy20Regular
          className={styles.wm_linkTileButton}
          onClick={(event) => {
            event.stopPropagation();
            handleCopyClick(redirectUrl);
          }}
        />
      )}

      <Dismiss20Regular
        className={styles.wm_linkTileRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          props.handleRemoveLinkedUser(props.user);
        }}
      />
    </div>
  );
};

export const TaskItemOverlayLinkTeamTile = (
  props: ITaskItemOverlayLinkTeamTileProps,
): JSX.Element => {
  return (
    <div
      onClick={() => handleTileClick(props.team.url)}
      className={styles.wm_linkTile}
    >
      <img
        src={imgTeams}
        alt={strings.taskItemLinkedTeams}
        title={strings.taskItemLinkedTeams}
        className={styles.wm_linkTileIcon}
      />

      <div className={styles.wm_linkTileText}>{props.team.displayName}</div>

      {props.team.url && (
        <Copy20Regular
          className={styles.wm_linkTileButton}
          onClick={(event) => {
            event.stopPropagation();
            handleCopyClick(props.team.url);
          }}
        />
      )}

      <Dismiss20Regular
        className={styles.wm_linkTileRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          props.handleRemoveLinkedTeam(props.team);
        }}
      />
    </div>
  );
};

export const TaskItemOverlayLinkSpSiteTile = (
  props: ITaskItemOverlayLinkSpSiteTileProps,
): JSX.Element => {
  return (
    <div
      onClick={() => handleTileClick(props.spSite.webUrl)}
      className={styles.wm_linkTile}
    >
      <img
        src={imgSharePoint}
        alt={strings.taskItemLinkedSites}
        title={strings.taskItemLinkedSites}
        className={styles.wm_linkTileIcon}
      />

      <div className={styles.wm_linkTileText}>{props.spSite.displayName}</div>

      {props.spSite.webUrl && (
        <Copy20Regular
          className={styles.wm_linkTileButton}
          onClick={(event) => {
            event.stopPropagation();
            handleCopyClick(props.spSite.webUrl);
          }}
        />
      )}

      <Dismiss20Regular
        className={styles.wm_linkTileRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          props.handleRemoveLinkedSpSite(props.spSite);
        }}
      />
    </div>
  );
};

export const TaskItemOverlayLinkFileTile = (
  props: ITaskItemOverlayLinkFileTileProps,
): JSX.Element => {
  return (
    <div
      onClick={() => handleTileClick(props.file.webUrl)}
      className={styles.wm_linkTile}
    >
      <img
        src={imgOneDrive}
        alt={strings.taskItemLinkedFiles}
        title={strings.taskItemLinkedFiles}
        className={styles.wm_linkTileIcon}
      />

      <div className={styles.wm_linkTileText}>{props.file.name}</div>

      {props.file.webUrl && (
        <Copy20Regular
          className={styles.wm_linkTileButton}
          onClick={(event) => {
            event.stopPropagation();
            handleCopyClick(props.file.webUrl);
          }}
        />
      )}

      <Dismiss20Regular
        className={styles.wm_linkTileRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          props.handleRemoveLinkedFile(props.file);
        }}
      />
    </div>
  );
};
