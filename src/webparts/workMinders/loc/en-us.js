define([], function () {
  return {
    // WORKMINDERS WEBPART
    // Property Pane
    propPaneDescription: "WebPart Settings",
    // Property Pane - Look and Feel
    propPaneLookAndFeel: "Look and Feel",
    propPaneHeight: "Height",
    propPaneHeightDescription:
      "Set the height of the web part. Default is 500px.",
    propPaneSmallUi: "Minimal UI",
    propPaneSmallUiDescription:
      "WorkMinders UI will be minimized. Ideal for multi-column placement.",
    // Property Pane - Version
    propPaneVersion: "Version",

    // Header
    headerAllTasks: "All Tasks",
    headerCompletedTasks: "Completed Tasks",
    headerOverdueTasks: "Overdue Tasks",
    headerUpcomingTasks: "Upcoming Tasks",
    headerImportantTasks: "Important Tasks",

    // TaskListView
    taskListViewNoTasks: "No tasks",
    taskListViewNoTasksDescription:
      "There are no tasks here. Add a new one by clicking the button below.",

    // TaskItem
    taskItemMarkAsComplete: "Mark as complete",
    taskItemMarkAsIncomplete: "Mark as incomplete",
    taskItemDelete: "Delete",
    taskItemEdit: "Edit",
    taskItemViewDetails: "View details",
    taskItemDueDate: "Due date",
    taskItemCreated: "Created",
    taskItemModified: "Modified",
    taskItemLinkedPeople: "Linked people",
    taskItemLinkedSites: "Linked sites",
    taskItemLinkedTeams: "Linked teams",
    taskItemLinkedFiles: "Linked files",

    // Environment
    AppLocalEnvironmentSharePoint:
      "The app is running on your local environment as SharePoint web part",
    AppLocalEnvironmentTeams:
      "The app is running on your local environment as Microsoft Teams app",
    AppLocalEnvironmentOffice:
      "The app is running on your local environment in office.com",
    AppLocalEnvironmentOutlook:
      "The app is running on your local environment in Outlook",
    AppSharePointEnvironment: "The app is running on SharePoint page",
    AppTeamsTabEnvironment: "The app is running in Microsoft Teams",
    AppOfficeEnvironment: "The app is running in office.com",
    AppOutlookEnvironment: "The app is running in Outlook",
    UnknownEnvironment: "The app is running in an unknown environment",
  };
});
