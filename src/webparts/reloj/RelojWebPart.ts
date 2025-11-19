import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import styles from './RelojWebPart.module.scss';
import * as strings from 'RelojWebPartStrings';

export interface IDigitalClockWebPartProps {
  description: string;
}

export default class DigitalClockWebPart extends BaseClientSideWebPart<IDigitalClockWebPartProps> {
  private intervalId: number | undefined;

  public render(): void {
    // Clear any existing interval to avoid duplicates on re-render
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }

    this.domElement.innerHTML = `
      <div class="${styles.digitalClock}">
        <div class="${styles.container}">
          <div class="${styles.row}">
            <div class="${styles.column}">
              <span class="${styles.title}">Reloj Digital</span>
              <p class="${styles.time}" id="digitalClockTime"></p>
              <p class="${styles.subTitle}">${this.properties.description}</p>
            </div>
          </div>
        </div>
      </div>`;

    this._updateTime();
    this.intervalId = window.setInterval(() => this._updateTime(), 1000);
  }

  protected onDispose(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }

  private _updateTime(): void {
    const now = new Date();
    const hours = this._formatTime(now.getHours());
    const minutes = this._formatTime(now.getMinutes());
    const seconds = this._formatTime(now.getSeconds());
    const timeString = `${hours}:${minutes}:${seconds}`;
    const timeElement = this.domElement.querySelector('#digitalClockTime');
    if (timeElement) {
      timeElement.textContent = timeString;
    }
  }

  private _formatTime(time: number): string {
    return time < 10 ? `0${time}` : String(time);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
