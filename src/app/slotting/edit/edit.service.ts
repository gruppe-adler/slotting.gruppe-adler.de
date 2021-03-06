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

  public get flagIcons() {
    return ['zeus', 'air', 'armor', 'art', 'hq', 'inf', 'maint', 'mech_inf', 'med', 'mortar', 'motor_inf', 'plane', 'recon', 'service', 'support', 'uav'];
  }

  public get slotPresets(): Array<{ shortcode: string, description: string }> {
    return [
      { shortcode: 'AA', description: 'Anti-Air Specialist' },
      { shortcode: 'AT', description: 'Anti-Tank Specialist' },
      { shortcode: 'AAA', description: 'Asst. Anti-Air Specialist' },
      { shortcode: 'AAT', description: 'Asst. Anti-Tank Specialist' },
      { shortcode: 'AAR', description: 'Asst. Autorifleman' },
      { shortcode: 'CLA', description: 'Asst. Company Leader' },
      { shortcode: 'CMA', description: 'Asst. Commander' },
      { shortcode: 'AMG', description: 'Asst. Machine Gunner' },
      { shortcode: 'PTA', description: 'Asst. Platoon Leader' },
      { shortcode: 'SQA', description: 'Asst. Squad Leader' },
      { shortcode: 'AR', description: 'Autorifleman' },
      { shortcode: 'CP', description: 'Co-Pilot' },
      { shortcode: 'CFR', description: 'Combat First Responder' },
      { shortcode: 'CMD', description: 'Commander' },
      { shortcode: 'CL', description: 'Company Leader' },
      { shortcode: 'DM', description: 'Designated Marksman' },
      { shortcode: 'DRV', description: 'Driver' },
      { shortcode: 'E', description: 'Engineer' },
      { shortcode: 'FTL', description: 'Fireteam Leader' },
      { shortcode: 'GRN', description: 'Grenadier' },
      { shortcode: 'GUN', description: 'Gunner' },
      { shortcode: 'JTAC', description: 'Joint Terminal Attack Controller' },
      { shortcode: 'MG', description: 'Machine Gunner' },
      { shortcode: 'M', description: 'Medic' },
      { shortcode: 'P', description: 'Pilot' },
      { shortcode: 'PTL', description: 'Platoon Leader' },
      { shortcode: 'PTM', description: 'Platoon Medic' },
      { shortcode: 'RTO', description: 'Radiotelephone Operator' },
      { shortcode: 'LAT', description: 'Rifleman (AT)' },
      { shortcode: 'R', description: 'Rifleman' },
      { shortcode: 'SQL', description: 'Squad Leader' },
      { shortcode: 'SQM', description: 'Squad Medic' },
      { shortcode: 'Z', description: 'Zeus' }
    ]
  }

  public get matchDirty() {
    return JSON.stringify(this.match) !== JSON.stringify(this.rawMatch);
  }


  public rawMatch: any;
  public match: any;
  private highlightedElement = null;

  constructor(private slottingService: SlottingService) {
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
    if (this.highlightedElement) {
      this.highlightedElement.classList.remove('drag-over');
    }
    if (nativeElement === this.highlightedElement) {
      return;
    }
    this.highlightedElement = nativeElement;
    this.highlightedElement.classList.add('drag-over');
  }

  public removeHighlightedContainer(nativeElement): void {
    if (this.highlightedElement === nativeElement) {
      this.highlightedElement.classList.remove('drag-over');
      this.highlightedElement = null;
    }
  }

  public async updateMatch(xmlMatch: string): Promise<boolean> {
    this.rawMatch = this.match;
    return await this.slottingService.updateMatch(this.match.uuid, xmlMatch);
  }
}
