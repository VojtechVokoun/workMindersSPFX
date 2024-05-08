declare interface IWorkMindersWebPartStrings {
  // WORKMINDERS WEBPART
  // Property Pane
  propPaneDescription: string;
  // Property Pane - Look and Feel
  propPaneLookAndFeel: string;
  propPaneHeight: string;
  propPaneHeightDescription: string;
  propPaneSmallUi: string;
  propPaneSmallUiDescription: string;
  // Property Pane - Version
  propPaneVersion: string;

  // Environment
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
}

declare module "WorkMindersWebPartStrings" {
  const strings: IWorkMindersWebPartStrings;
  export = strings;
}
