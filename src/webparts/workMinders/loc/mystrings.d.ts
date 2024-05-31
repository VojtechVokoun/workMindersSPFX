declare interface IWorkMindersWebPartStrings {
  // General Actions
  done: string;
  cancel: string;
  edit: string;
  delete: string;

  // Web Part Status
  oneDriveDoesNotExist: string;
  loadingData: string;

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

  // Default task sections
  tasksAll: string;
  tasksCompleted: string;
  tasksOverdue: string;
  tasksUpcoming: string;
  tasksImportant: string;

  // ContentView
  taskListViewNoTasks: string;
  taskListViewNoTasksDescription: string;
  addTask: string;

  // TaskItem
  taskItemMarkAsComplete: string;
  taskItemMarkAsIncomplete: string;
  taskItemDelete: string;
  taskItemEdit: string;
  taskItemViewDetails: string;
  taskItemDueDate: string;
  taskItemCreated: string;
  taskItemModified: string;
  taskItemLinkedPeople: string;
  taskItemLinkedSites: string;
  taskItemLinkedTeams: string;
  taskItemLinkedFiles: string;
  taskItemImportant: string;

  // TaskOverlay
  editTask: string;
  title: string;
  titlePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  save: string;
  discard: string;

  // TagChoice
  tags: string;
  addTag: string;

  // Add/Edit Tag
  addTagPlaceholder: string;
  editTagPlaceholder: string;
  tagHint: string;

  // Delete Tag
  tagDeleteDescription: string;

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
