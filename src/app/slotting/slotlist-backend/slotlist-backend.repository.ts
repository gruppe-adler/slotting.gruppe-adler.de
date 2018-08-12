import {Match} from '../models/match';
import {Observable} from 'rxjs';
import {EventService} from './event-service';
import {AuthProviderService} from './auth-provider.service';
import {Injectable} from '@angular/core';
import {MissionCreate} from '../models/slotlist-backend/aliases';
import {MissionService} from './mission-service';

@Injectable()
export class SlotlistBackendRepository {
  private tid: number;

  public constructor(
    private authProviderService: AuthProviderService,
    private missionService: MissionService,
    private eventService: EventService,
  ) {
    this.tid = eventService.getTid();
  }

  public async save(match: Match) {
    // window.console.info('MATCH MODEL:');
    // window.console.info(JSON.stringify(match, null, '\t'));
    const observable = Observable.create();

    this.addSlots(match);
  }

  private addSlots(match: Match): void {
    // this.tid
  }

}
