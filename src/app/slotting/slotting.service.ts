import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable()
export class SlottingService implements OnDestroy {
  public match: any;
  public rawMatch: any;
  public slots = [];
  public slottedCount = 0;
  public socket: any;
  public tid: number;
  public matchid: string;
  public showGroupsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private slottingInProgress = false;
  private unslottingInProgress = false;

  constructor(private http: HttpClient) {
    this.initWebsocket();

    window.addEventListener('storage', event => {
      if (event.key === environment.storageKeys.showGroupColor) {
        this.showGroupsChanged.emit(event.newValue === 'true');
      }
    });
  }

  public async getMatch(tid: number, matchid: string): Promise<any> {
    this.tid = tid;
    this.matchid = matchid;

    try {
      const match = await this.http.get(
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}?withusers=1`, {withCredentials: true}).toPromise();
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
    if (this.slottingInProgress) {
      return false;
    }
    this.slottingInProgress = true;
    const uid = await this.getOwnUserId();
    console.log(uid);
    try {
      await this.http.put(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid + '/slot/' + slotid + '/user', {uid}, {withCredentials: true}).toPromise();
      this.slottingInProgress = false;
      return true;
    } catch (e) {
      console.log(e);
      this.slottingInProgress = false;
      return false;
    }
  }

  public async unslotUser(slotid: string): Promise<boolean> {
    if (this.unslottingInProgress) {
      return false;
    }
    this.unslottingInProgress = true;
    try {
      await this.http.delete(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid + '/slot/' + slotid + '/user', {withCredentials: true}).toPromise();
      this.unslottingInProgress = false;
      return true;
    } catch (e) {
      console.log(e);
      this.unslottingInProgress = false;
      return false;
    }
  }

  public async getOwnUserId(): Promise<string> {
    if (window.parent && window.parent['app'] && window.parent['app'].user) {
      return window.parent['app'].user.uid;
    }

    try {
      const result = await this.http.get(environment.api.forumUrl + '/me', {withCredentials: true}).toPromise();
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
        },
        withCredentials: true
      }).toPromise();
      console.log(result);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async getPermissions(tid = this.tid): Promise<any> {
    try {
      return await this.http.get(environment.api.forumUrl + '/arma3-slotting/' + tid + '/has-permissions', {withCredentials: true}).toPromise();
    } catch (e) {
      return null;
    }
  }

  public toggleShowGroups(): void {
    const currentValue = localStorage.getItem(environment.storageKeys.showGroupColor) || 'false';
    const newValue = currentValue === 'false' ? 'true' : 'false';
    localStorage.setItem(environment.storageKeys.showGroupColor, newValue);
    this.showGroupsChanged.emit(newValue === 'true');
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

  public async deleteMatch(): Promise<boolean> {
    try {
      await this.http.delete(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + this.matchid).toPromise();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
