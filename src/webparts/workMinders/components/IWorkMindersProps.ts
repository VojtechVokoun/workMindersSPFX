import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IWorkMindersProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  webpartContext: WebPartContext;
}
