import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable()
export class SlottingService implements OnDestroy {
  public matches: any[];
  public slots = {};
  public socket: any;
  public tid: number;
  public permissions: any;
  public showGroupsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public matchChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public slotlistCondensed = false;
  public bootboxConfirmResolver: any;
  public slotChanged: EventEmitter<any> = new EventEmitter<any>();

  private slottingInProgress = false;
  private unslottingInProgress = false;

  constructor(private http: HttpClient) {
    this.initWebsocket();
    this.initCondensedView();

    window.addEventListener('storage', event => {
      if (event.key === environment.storageKeys.showGroupColor) {
        this.showGroupsChanged.emit(event.newValue === 'true');
      }
    });

    window.addEventListener('message', event => {
      if (!event.data || !event.data.type) {
        return;
      }

      switch (event.data.type) {
        case 'bootboxConfirmResult': {
          console.log('confirm result', event.data.data);
          this.bootboxConfirmResolver(event.data.data);
          this.bootboxConfirmResolver = null;
        } break;

        case 'bootboxConfirm': {
          const result = confirm(event.data.data);
          window.parent.postMessage({
            type: 'bootboxConfirmResult',
            data: result
          }, '*');
          console.log('bootbox confirm');
        } break;

        case 'bootboxAlert': {
          alert(event.data.data);
        } break;

        case 'windowScrollBy': {
          window.scrollBy(event.data.data.x, event.data.data.y);
        } break;
      }
    });
  }

  public async getMatch(tid: number, matchid: string): Promise<any> {
    this.tid = tid;

    try {
      const match = await this.http.get(
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}?withusers=1`, {withCredentials: true}).toPromise();
      this.parseMatch(match);
      this.refreshSlottedCount((match as any).uuid);
      console.log(match);
      return match;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async findMatch(tid = this.tid, matchid: string): Promise<any> {
    if (!this.matches || this.matches.length === 0) {
      console.log('loading matches');
      await this.getMatches(this.tid);
    }
    return this.matches.find(x => x.uuid === matchid);
  }

  public async getMatches(tid: number): Promise<any[]> {
    this.tid = tid;

    try {
      const matches = await this.http.get<any[]>(
        `${environment.api.forumUrl}/arma3-slotting/${tid}`, {withCredentials: true}).toPromise();
      this.matches = [];
      for (let i = 0; i < matches.length; i++) {
        let match = matches[i];
        match = await this.getMatch(this.tid, match.uuid);
        this.matches.push(match);
      }
      this.permissions = await this.getPermissions();
      console.log('permissions', this.permissions);
      return this.matches;
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
    return this.parseMatchRecursive(match, match.uuid);
  }

  private parseMatchRecursive(match: any, uuid: string): any {
    ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {
      if (match[currentFilter] && match[currentFilter].length > 0) {
        match[currentFilter].forEach(current => {
          // Parse out slots
          if (currentFilter === 'slot') {
            this.slots[uuid] = this.slots[uuid] || [];
            this.slots[uuid].push(current);
          }
          this.parseMatchRecursive(current, uuid);
        });
      }
    });

    return match;
  }

  private refreshSlottedCount(matchid: string): void {
    console.log('updating slotted count');
    const result = this.matches.find(x => x.uuid === matchid);
    if (result) {
      result.slottedPlayerCount = this.slots[result.uuid].filter(x => x.user).length;
    }
  }

  private initWebsocket(): void {
    this.socket = io(environment.api.forumSocketUrl);
    this.socket.on('connect', () => {
      console.log('socket.io connected');
    });

    this.socket.on('event:match-changed', async data => {
      console.log('match update', data);
      if (data.tid.toString() !== this.tid) {
        return;
      }

      const index = this.matches.findIndex(x => x.uuid === data.matchid);
      if (index > -1) {
        this.matches[index] = await this.getMatch(this.tid, data.matchid);
        this.matchChanged.emit(true);
        console.log('match changed');
      } else {
        console.log('getting match changed');
        const match = await this.getMatch(this.tid, data.matchid);
        if (match) {
          this.matches.splice(0, 0, match);
        }
      }
    });

    this.socket.on('event:user-slotted', data => {
      const slots = this.slots[data.matchid] || [];
      const oldSlot = slots.find(slot =>
        slot.user &&
        ((slot.user.uid !== -1 && slot.user.uid === data.user.uid) ||
          (slot.user.username === data.user.username && slot.user.userslug === data.user.username && slot.user['icon:text'] === data.user['icon:text'])));
      if (oldSlot) {
        console.log('old slot', oldSlot);
        delete oldSlot.user;
        this.slotChanged.emit(oldSlot);
      }

      const newSlot = slots.find(slot => slot.uuid === data.slot);
      if (newSlot) {
        console.log('new slot', newSlot);
        newSlot.user = data.user;
        this.slotChanged.emit(newSlot);
      }
      this.refreshSlottedCount(data.matchid);
    });

    this.socket.on('event:user-unslotted', data => {
      const slots = this.slots[data.matchid] || [];
      slots.forEach(slot => {
        if (slot.uuid === data.slot) {
          delete slot.user;
          this.slotChanged.emit(slot);
        }
      });
      this.refreshSlottedCount(data.matchid);
    });
  }

  public ngOnDestroy(): void {
    this.socket.close();
  }

  public async slotUser(matchid: string, slotid: string, uid: any = undefined): Promise<boolean> {
    if (this.slottingInProgress) {
      return false;
    }
    this.slottingInProgress = true;
    if (!uid) {
      uid = await this.getOwnUserId();
    }

    console.log(uid);
    try {
      await this.http.put(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + matchid + '/slot/' + slotid + '/user', {uid}, {withCredentials: true}).toPromise();
      this.slottingInProgress = false;
      return true;
    } catch (e) {
      console.log(e);
      this.slottingInProgress = false;
      return false;
    }
  }

  public async unslotUser(matchid: string, slotid: string): Promise<boolean> {
    if (this.unslottingInProgress) {
      return false;
    }
    this.unslottingInProgress = true;
    try {
      await this.http.delete(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + matchid + '/slot/' + slotid + '/user', {withCredentials: true}).toPromise();
      this.unslottingInProgress = false;
      return true;
    } catch (e) {
      console.log(e);
      this.unslottingInProgress = false;
      return false;
    }
  }

  public async getOwnUserId(): Promise<string> {
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

  public showNodebbAlert(title: string, message: string = '', type: string = 'success', timeout: number = 2000): void {
    window.parent.postMessage({
      type: 'alert',
      data: {
        title: title,
        message: message,
        location: 'left-bottom',
        timeout: timeout,
        type: type,
        image: ''
      }
    }, '*');
  }

  public async updateMatch(matchid: string, content: string): Promise<boolean> {
    console.log(content);
    while (content.startsWith(' ')) {
      content = content.substr(1, content.length - 1);
    }

    if (!content.startsWith('<match')) {
      content = '<match>' + content + '</match>';
    }

    try {
      await this.http.put(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + matchid, content, {
        headers: {
          Accept: 'application/json; charset=utf-8',
          'Content-Type': 'application/xml',
        },
        withCredentials: true
      }).toPromise();
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
    window.parent.postMessage({
      type: 'bootboxAlert',
      data: message
    }, '*');
  }

  public async bootboxConfirm(message: string): Promise<boolean> {
    const promise = new Promise<boolean>(resolve => this.bootboxConfirmResolver = resolve);

    window.parent.postMessage({
      type: 'bootboxConfirm',
      data: message
    }, '*');

    return promise;
  }

  public async deleteMatch(matchid: string): Promise<boolean> {
    try {
      await this.http.delete(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match/' + matchid, {withCredentials: true}).toPromise();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async createMatch(): Promise<string> {
    try {
      const response = await this.http.post(environment.api.forumUrl + '/arma3-slotting/' + this.tid + '/match', '<match></match>', {withCredentials: true}).toPromise();
      if (response['uuid']) {
        this.matches.splice(0, 0, response);
        return response['uuid'];
      }
      return '';
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  public toggleCondensedView(): void {
    try {
        const value = localStorage[environment.storageKeys.showMinified] === 'true';
        localStorage[environment.storageKeys.showMinified] = !value;
        this.slotlistCondensed = !value;
    } catch (e) {
      console.warn(e);
    }
  }

  private initCondensedView(): void {
    try {
        this.slotlistCondensed = localStorage[environment.storageKeys.showMinified] === 'true';
    } catch (e) {
      console.warn(e);
    }
  }

  public isCondensedView(): boolean {
    return this.slotlistCondensed;
  }
}
