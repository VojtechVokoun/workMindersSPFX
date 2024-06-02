import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { type IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";
import { PropertyPaneWebPartInformation } from "@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation";

import WorkMinders, { IWorkMindersProps } from "./components/WorkMinders";

import * as strings from "WorkMindersWebPartStrings";

export interface IWorkMindersWebPartProps {
  height: number;
}

export default class WorkMindersWebPart extends BaseClientSideWebPart<IWorkMindersWebPartProps> {
  private _isDarkTheme: boolean = false;

  public render(): void {
    const element: React.ReactElement<IWorkMindersProps> = React.createElement(
      WorkMinders,
      {
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        webpartContext: this.context,
        height: this.properties.height,
      },
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      console.log(message);
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
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
                PropertyFieldNumber("height", {
                  key: "height",
                  label: strings.propPaneHeight,
                  description: strings.propPaneHeightDescription,
                  value: this.properties.height,
                }),
              ],
            },
            {
              groupName: strings.propPaneVersion,
              groupFields: [
                PropertyPaneWebPartInformation({
                  description: `WorkMinders v${this.context.manifest.version}<br><a href="https://www.vokounapps.cz" target="_blank">VokounApps</a>`,
                  key: `webPartInfoId`,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
