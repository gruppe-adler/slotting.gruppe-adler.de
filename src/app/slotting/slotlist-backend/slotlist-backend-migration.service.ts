import {Match} from '../models/match';
import {EventService} from './event-service';
import {AuthProviderService} from './auth-provider.service';
import {Injectable} from '@angular/core';
import {MissionService} from './mission-service';
import {SlotGroupService} from './slot-group.service';

@Injectable()
export class SlotlistBackendMigrationService {
  private tid: number;

  public constructor(
    private authProviderService: AuthProviderService,
    private missionService: MissionService,
    private slotGroupService: SlotGroupService,
    private eventService: EventService,
  ) {
    this.tid = eventService.getTid();
  }

  public async save(match: Match) {

    this.addSlots(match);
  }

  private addSlots(match: Match): void {
    this.slotGroupService.postSlotGroups(match);
  }
}
