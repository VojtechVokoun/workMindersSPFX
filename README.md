# WorkMinders

WorkMinders – a task manager built for Microsoft 365.

## Summary

WorkMinders is a task manager built for Microsoft 365. It allows users to create and track tasks.
This tool is built for colalboration, so users can link users, teams, documents and SharePoint Sites to their tasks.

The data is saved on OneDrive in JSON format, so users can access their tasks from anywhere, even when they don't
have access to the SharePoint site where the solution is deployed.

The solution is built using SharePoint Framework and React.

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.18.2-green.svg)

## Prerequisites

- Office 365 subscription with SharePoint Online
- OneDrive for Business to store the tasks

## Version history

| Version | Date         | Comments        |
|---------|--------------|-----------------|
| 1.0.0   | June 2, 2024 | Initial release |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED
WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

To test this web part in your SharePoint environment, follow these steps:

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
    - **npm install**
    - **gulp serve**

> **Note:** It is possible that it will not be fully functional, this is because the web part requires permissions to
> access the Microsoft Graph API through delegated permissions. To get the full functionality, you need to deploy the
> web part to SharePoint.

## Deployment

To deploy this web part to SharePoint, run the following commands:

- **gulp bundle --ship**
- **gulp package-solution --ship**
- Upload the .sppkg file from the sharepoint/solution folder to the App Catalog
- Go to the API Access page in the SharePoint Admin Center and approve the requested permissions
- Add the app to the site where you want to use it
- Add the web part to a page
- _Optional: Set the height of the web part to your liking_
- Enjoy!
