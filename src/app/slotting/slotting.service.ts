import { Injectable, OnDestroy } from '@angular/core';
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
      this.refreshSlottedCount();
    });

    this.socket.on('event:user-unslotted', () => {
      this.refreshSlottedCount();
    });
  }

  public ngOnDestroy(): void {
    this.socket.close();
  }
}
