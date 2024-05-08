import { WebPartContext } from "@microsoft/sp-webpart-base";
import { TWorkMinder } from "../types/ItemTypes";

export interface IWorkMindersProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  webpartContext: WebPartContext;
  workMinders: TWorkMinder[];
  height: number;
  oneDriveDoesNotExist: boolean;
}
