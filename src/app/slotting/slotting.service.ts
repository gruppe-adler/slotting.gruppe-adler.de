import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import * as xml from 'js2xmlparser';

@Injectable()
export class SlottingService implements OnDestroy {
  public match: any;
  public rawMatch: any;
  public slots = [];
  public slottedCount = 0;
  public socket: any;
  public tid: number;
  public matchid: string;

  constructor(private http: HttpClient) {
    this.initWebsocket();
  }

  public async getMatch(tid: number, matchid: string): Promise<any> {
    this.tid = tid;
    this.matchid = matchid;

    try {
      const match = await this.http.get(
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}?withusers=1`).toPromise();
      this.rawMatch = { ...match };
      this.parseMatch(match);
      this.refreshSlottedCount();
      console.log(match);
      this.match = match;
      return this.match;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Parses a match
   * Filters out all slots to separate them and applies all reserved-for attributes
   * @param match
   */
  private parseMatch(match: any): any {
    this.slots = [];

    return this.parseMatchRecursive(match);
  }

  private parseMatchRecursive(match: any): any {
    ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {
      if (match[currentFilter] && match[currentFilter].length > 0) {
        match[currentFilter].forEach(current => {
          // Parse out slots
          if (currentFilter === 'slot') {
            this.slots.push(current);
            if (current.user) {
            }
          }
          this.parseMatchRecursive(current);
        });
      }
    });

    return match;
  }

  private refreshSlottedCount(): void {
    this.slottedCount = 0;
    this.slots.forEach(slot => {
      if (slot.user) {
        this.slottedCount++;
      }
    });
  }

  private initWebsocket(): void {
    this.socket = io(environment.api.forumSocketUrl);
    this.socket.on('connect', () => {
      console.log('connected');
    });

    this.socket.on('event:match-changed', data => {
      if (this.match && this.match.uuid === data.matchid) {
        this.getMatch(this.tid, this.matchid);
      }
    });

    this.socket.on('event:user-slotted', () => {
      setTimeout(() => {
        this.refreshSlottedCount();
      }, 400);
    });

    this.socket.on('event:user-unslotted', () => {
      setTimeout(() => {
        this.refreshSlottedCount();
      }, 400);
    });
  }

  public ngOnDestroy(): void {
    this.socket.close();
  }

  public async slotUser(slotid: string): Promise<boolean> {
    const uid = await this.getOwnUserId();
    console.log(uid);
    try {
      await this.http.put(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid + '/slot/' + slotid + '/user', {uid}).toPromise();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async unslotUser(slotid: string): Promise<boolean> {
    try {
      await this.http.delete(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid + '/slot/' + slotid + '/user').toPromise();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private async getOwnUserId(): Promise<string> {
    if (window.parent && window.parent['app'] && window.parent['app'].user) {
      return window.parent['app'].user.uid;
    }

    try {
      const result = await this.http.get(environment.api.forumUrl + '/me').toPromise();
      if (result['uid']) {
        return result['uid'];
      }
      return '';
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  public showNodebbAlert(title: string, message: string, type: string = 'success', timeout: number = 2000): void {
    if (!window.parent['app'] || !window.parent['app'].alert) {
      return;
    }

    window.parent['app'].alert({
      title: title,
      message: message,
      location: 'left-bottom',
      timeout: timeout,
      type: type,
      image: ''
    });
  }

  public getMatchXml(): string {
    console.log('test');
    console.log(this.match);
    const match = this.parseMatchForXml(JSON.parse(JSON.stringify(this.match)));
    const xmlMatch = xml.parse('match', match, {format: {doubleQuotes: true}});
    return xmlMatch.replace(/<\?xml.+\?>\n/, '');
  }

  private parseMatchForXml(rawMatch: any): any {
    function recurse(match: any): any {
      ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {

        if (match[currentFilter] && match[currentFilter].length > 0) {
          match[currentFilter].forEach(current => {
            // Delete current user and slotted player count
            if (current.user) {
              console.log('delete', current.user);
              delete current.user;
            }
            delete current.slottedPlayerCount;

            // Take all keys and apply them as attributes
            const attributes = current['@'] || {};
            Object.keys(current).forEach(key => {
              if (['company', 'platoon', 'squad', 'fireteam', 'slot'].indexOf(key) === -1) {
                attributes[key] = current[key];
                delete current[key];
              }
              console.log(key);
            });
            current['@'] = attributes;

            recurse(current);
          });
        }
      });

      return match;
    }

    rawMatch['@'] = {uuid: rawMatch.uuid};
    delete rawMatch.uuid;
    delete rawMatch.slottedPlayerCount;
    return recurse(rawMatch);
  }

  public async updateMatch(content: string): Promise<boolean> {
    console.log(content);
    while (content.startsWith(' ')) {
      content = content.substr(1, content.length - 1);
    }

    if (!content.startsWith('<match')) {
      content = '<match>' + content + '</match>';
    }

    try {
      const result = await this.http.put(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid, content, {
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/xml',
        }
      }).toPromise();
      console.log(result);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getPermissions(tid = this.tid, matchid = this.matchid): Promise<any> {
    try {
      return await this.http.get(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/has-permissions').toPromise();
    } catch (e) {
      return null;
    }
  }

  public bootbox(message: string): void {
    if (!window.parent['bootbox']) {
      alert(message);
      return;
    }

    window.parent['bootbox'].alert(message);
  }

  public bootboxConfirm(message: string, callback): void {
    if (!window.parent['bootbox']) {
      callback(confirm(message));
      return;
    }

    window.parent['bootbox'].confirm(message, callback);
  }
}
