import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';

@Injectable()
export class SharedService {
  public readonly ownSlotColor = '#49b73a';
  public readonly foreignSlotColor = '#673ab7';
  public currentSelectedSlot: any;
  public match: BehaviorSubject<any> = new BehaviorSubject(null);
  public slots = [];
  public shareData: any;
  public socket;

  public slotChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
    this.initWebsocket();
  }

  public async getMatch(tid: number, matchid: string, uuid: string, reservation: string): Promise<any> {
    try {
      const match = await this.http.get(
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}?withusers=1`,
        {headers: this.getHeaders(uuid, reservation)}).toPromise();
      this.parseMatch(match);
      console.log(match);
      this.match.next(match);
      return this.match;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  /**
   * Parses a match
   * Filters out all slots to separate them, finds own occupied slot if not an admin and applies all reserved-for attributes
   * @param match
   */
  private parseMatch(match: any): any {
    this.slots = [];
    const slotuuid = this.getMatchStorage(this.shareData.tid, this.shareData.matchid);

    return this.parseMatchRecursive(match, slotuuid);
  }

  private parseMatchRecursive(match: any, slotuuid: string, reservation = ''): any {
    ['company', 'platoon', 'squad', 'fireteam', 'slot'].forEach(currentFilter => {
      if (match[currentFilter] && match[currentFilter].length > 0) {
        match[currentFilter].forEach(current => {
          // Parse out slots
          if (currentFilter === 'slot') {
            // this.slots.push(current);

            // Find occupied slot when not admin
            if (current.user && slotuuid && !this.shareData.adminUuid && current.uuid === slotuuid) {
              this.currentSelectedSlot = current;
              current.user['icon:bgColor'] = this.ownSlotColor;
            }
          }

          this.parseMatchRecursive(current, slotuuid, reservation);
          // Apply reserved-for attribute to all elementes
          /*
          current = this.parseMatchRecursive(current, slotuuid, current['reserved-for'] ? current['reserved-for'] : reservation);
          if (!current['reserved-for'] && current['reserved-for'] !== '' && reservation !== '') {
            current['reserved-for'] = reservation;
          }*/
        });
      }
    });

    return match;
  }

  public async getTopic(tid: number, matchid: string, uuid: string): Promise<any> {
    try {
      return await this.http.get(`${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}/share/${uuid}/topic`).toPromise();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getShare(tid: number, matchid: string, uuid: string): Promise<any> {
    try {
      this.shareData = await this.http.get(`${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}/share/${uuid}`).toPromise();
      this.shareData.tid = tid;
      this.shareData.matchid = matchid;
      return this.shareData;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async slotUser(tid: number, matchid: string, uuid: string, reservation: string, slotid: string, username: string): Promise<boolean> {
    const body = {
      shareKey: uuid,
      reservation,
      username
    };

    try {
      const response = await this.http.put(
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}/slot/${slotid}/user`, body,
        {observe: 'response', headers: this.getHeaders(uuid, reservation)}).toPromise();
      return response.status === 204;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public async deleteSlotUser(tid: number, matchid: string, uuid: string, reservation: string, slotid: string, username: string): Promise<boolean> {
    const body = {
      shareKey: uuid,
      reservation,
      username
    };

    try {
      const response = await this.http.request(
        'delete',
        `${environment.api.forumUrl}/arma3-slotting/${tid}/match/${matchid}/slot/${slotid}/user`,
        {body, observe: 'response', headers: this.getHeaders(uuid, reservation)}).toPromise();
      return response.status === 204;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * Gets the slot uuid out of localstorage for the given match
   * @param {number} tid
   * @param {string} matchid
   * @returns {string}
   */
  public getMatchStorage(tid: number, matchid: string): string {
    return localStorage.getItem(this.getStorageKey(tid, matchid));
  }

  /**
   * Sets the slot uuid in localstorage for the given match
   * @param {number} tid
   * @param {string} matchid
   * @param slotid
   */
  public setMatchStorage(tid: number, matchid: string, slotid: string): void {
    localStorage.setItem(this.getStorageKey(tid, matchid), slotid);
  }

  private getStorageKey(tid: number, matchid: string): string {
    return `gruppe-adler.de-events-${tid}-${matchid}`;
  }

  private getHeaders(uuid: string, reservation: string): any {
    return {
      'X-Share-Key': uuid,
      'X-Reservation': reservation,
      'Accept': 'application/json'
    };
  }

  private initWebsocket(): void {
    this.socket = io(environment.api.forumSocketUrl);
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('event:user-slotted', data => {
      const oldSlot = this.slots.find(slot =>
        slot.user &&
        ((slot.user.uid !== -1 && slot.user.uid === data.user.uid) ||
          (slot.user.username === data.user.username && slot.user.userslug === data.user.username && slot.user['icon:text'] === data.user['icon:text'])));
      if (oldSlot) {
        console.log('old slot', oldSlot);
        delete oldSlot.user;
        this.slotChanged.emit(oldSlot);
      }

      const newSlot = this.slots.find(slot => slot.uuid === data.slot);
      if (newSlot) {
        console.log('new slot', newSlot);
        newSlot.user = data.user;
        this.slotChanged.emit(newSlot);
      }
    });

    this.socket.on('event:user-unslotted', data => {
      this.slots.forEach(slot => {
        if (slot.uuid === data.slot) {
          delete slot.user;
          this.slotChanged.emit(slot);
        }
      });
    });

    this.socket.on('event:match-changed', data => {
      if (this.shareData && this.match && this.shareData.matchid === data.matchid) {
        this.getMatch(this.shareData.tid, this.shareData.matchid, this.shareData.publicUuid, this.shareData.reservation);
      }
    });
  }
}
