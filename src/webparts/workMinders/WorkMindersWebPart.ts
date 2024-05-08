import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";

import WorkMinders from "./components/WorkMinders";
import { IWorkMindersProps } from "./components/IWorkMindersProps";
import { TWorkMinder } from "./types/ItemTypes";

import * as strings from "WorkMindersWebPartStrings";

export interface IWorkMindersWebPartProps {
  height: number;
}

export default class WorkMindersWebPart extends BaseClientSideWebPart<IWorkMindersWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _workMinders: TWorkMinder[] = [];
  private _oneDriveDoesNotExist: boolean = false;

  //private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IWorkMindersProps> = React.createElement(
      WorkMinders,
      {
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        webpartContext: this.context,
        height: this.properties.height,
        oneDriveDoesNotExist: this._oneDriveDoesNotExist,
        workMinders: this._workMinders,
      },
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getWorkMinders()
      .then((data: TWorkMinder[] | undefined) => {
        if (data) {
          this._workMinders = data;
        } else {
          this._workMinders = [];
        }
      })
      .catch((error) => {
        console.error(`onInit: ${error}`);
      });
    //return this._getEnvironmentMessage().then((message) => {
    //this._environmentMessage = message;
    //});
  }

  /*private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment,
    );
  }*/

  /**
   * Fetches all reminders from user's OneDrive.
   * @private
   */
  private async _getWorkMinders(): Promise<TWorkMinder[] | undefined> {
    // Get the Graph client
    const graphClient: MSGraphClientV3 =
      await this.context.msGraphClientFactory.getClient("3");

    // Find out if the user has a OneDrive
    // Get the user's OneDrive
    const oneDrive = await graphClient
      .api("/me/drive")
      .version("v1.0")
      .get()
      .catch((error: unknown) => {
        console.error(`_getReminders: ${error}`);
        return;
      });

    // If the user doesn't have a OneDrive, set the flag and return
    if (!oneDrive) {
      this._oneDriveDoesNotExist = true;
      return;
    }

    // See if the 'WorkMinders App' folder exists, if not, create it
    // Get the 'WorkMinders App' folder
    const workMindersFolder = await graphClient
      .api(`/me/drive/root/children`)
      .version("v1.0")
      .filter("name eq 'WorkMinders App'")
      .get()
      .catch((error: unknown) => {
        console.error(`_getReminders: ${error}`);
        return null;
      });

    console.log(workMindersFolder);

    // If the folder doesn't exist, create it and return
    if (!workMindersFolder.value.length) {
      console.log("Creating the 'WorkMinders App' folder");

      await graphClient
        .api("/me/drive/root/children")
        .version("v1.0")
        .post({
          name: "WorkMinders App",
          folder: {},
        })
        .catch((error: unknown) => {
          console.error(`_getReminders: ${error}`);
        });

      return;
    }

    // Get the reminders
    const reminders = await graphClient
      .api(`/me/drive/root:/WorkMinders App:/children`)
      .version("v1.0")
      .get()
      .catch((error: unknown) => {
        console.error(`_getReminders: ${error}`);
        return null;
      });

    // TODO: remove after testing
    console.log(reminders.value);

    // Process the reminders
    // TODO: implement
    return reminders.value;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null,
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null,
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.propPaneDescription,
          },
          groups: [
            {
              groupName: strings.propPaneLookAndFeel,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.propPaneHeight,
                  description: strings.propPaneHeightDescription,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
