import { Injectable } from '@angular/core';
import * as xml from 'xml2js';
import { SlottingService } from '../slotting.service';

@Injectable()
export class EditService {
  public get defaultSlot() {
    return {
      shortcode: 'R',
      description: 'Rifleman',
      newSlot: true
    };
  }

  public get firstCompanySlot() {
    return {
      shortcode: 'CL',
      description: 'Company Leader',
      newSlot: true
    };
  }

  public get firstPlatoonSlot() {
    return {
      shortcode: 'PTL',
      description: 'Platoon Leader',
      newSlot: true
    };
  }

  public get firstSquadSlot() {
    return {
      shortcode: 'SQL',
      description: 'Squad Leader',
      newSlot: true
    };
  }

  public get firstFireteamSlot() {
    return {
      shortcode: 'FTL',
      description: 'Fireteam Leader',
      newSlot: true
    };
  }

  public get matchDirty() {
    return JSON.stringify(this.match) !== JSON.stringify(this.rawMatch);
  }


  public rawMatch: any;
  public match: any;
  private highligtedElement = null;

  constructor(private slottingService: SlottingService) {
    this.init(this.slottingService.match);
  }

  init(match: any): void {
    this.rawMatch = JSON.parse(JSON.stringify(match));
    this.match = JSON.parse(JSON.stringify(match));
  }

  public getMatchXml(): string {
    const parsedMatch = this.parseMatchForXml(JSON.parse(JSON.stringify(this.match)));
    const builder = new xml.Builder({
      rootName: 'match',
      headless: true
    });
    const xmlMatch = builder.buildObject(parsedMatch);
    return xmlMatch;
  }

  private parseMatchForXml(rawMatch: any): any {
    function recurse(match: any): any {
      ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {

        if (match[currentFilter] && match[currentFilter].length > 0) {
          match[currentFilter].forEach(current => {
            // Delete current user and slotted player count
            if (current.user) {
              delete current.user;
            }
            delete current.slottedPlayerCount;
            // Apply default slot attributes to prevent problems
            if (currentFilter === 'slot') {
              current.description = current.description || 'Rifleman';
              current.shortcode = current.shortcode || 'R';
            }

            // Take all keys and apply them as attributes
            const attributes = current['$'] || {};
            Object.keys(current).forEach(key => {
              if (['company', 'platoon', 'squad', 'fireteam', 'slot'].indexOf(key) === -1) {
                attributes[key] = current[key];
                delete current[key];
              }
            });
            current['$'] = attributes;

            recurse(current);
          });
        }
      });

      return match;
    }

    rawMatch['$'] = {uuid: rawMatch.uuid};
    delete rawMatch.uuid;
    delete rawMatch.slottedPlayerCount;
    return recurse(rawMatch);
  }

  public updateMatchFromXml(xmlMatch: string): void {
    xml.parseString(xmlMatch, (err, result) => {
      this.match = this.parseMatchFromXml(result);
    });
  }

  private parseMatchFromXml(rawMatch: any): any {
    function recurse(match: any): any {
      ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {

        if (match[currentFilter] && match[currentFilter].length > 0) {
          match[currentFilter].forEach(current => {
            // Take all attributes and apply them as properties
            const attributes = current['$'] || {};
            Object.keys(attributes).forEach(key => {
              current[key] = attributes[key];
            });
            delete current['$'];

            recurse(current);
          });
        }
      });

      return match;
    }

    rawMatch = rawMatch.match;
    const matchAttributes = rawMatch['$'] || {};
    console.log(matchAttributes);
    Object.keys(matchAttributes).forEach(key => {
      rawMatch[key] = matchAttributes[key];
    });
    delete rawMatch['$'];

    return recurse(rawMatch);
  }

  public updateHighlightedContainer(nativeElement): void {
    if (this.highligtedElement) {
      this.highligtedElement.classList.remove('drag-over');
    }
    if (nativeElement === this.highligtedElement) {
      return;
    }
    this.highligtedElement = nativeElement;
    this.highligtedElement.classList.add('drag-over');
  }

  public removeHighlightedContainer(nativeElement): void {
    if (this.highligtedElement === nativeElement) {
      this.highligtedElement.classList.remove('drag-over');
      this.highligtedElement = null;
    }
  }

  public async updateMatch(xmlMatch: string): Promise<boolean> {
    this.rawMatch = this.match;
    return await this.slottingService.updateMatch(xmlMatch);
  }
}
