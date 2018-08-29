import {Match} from '../models/match';
import {EventService} from './event-service';
import {AuthProviderService} from './auth-provider.service';
import {Injectable} from '@angular/core';
import {MissionService} from './mission-service';
import {SlotGroupService} from './slot-group.service';

@Injectable()
export class SlotlistBackendMigrationService {
  private tid: number;

  private epochString = '1970-01-01T00:00:00Z';

  public constructor(
    private authProviderService: AuthProviderService,
    private missionService: MissionService,
    private slotGroupService: SlotGroupService,
    private eventService: EventService,
  ) {
    this.tid = eventService.getTid();
  }

  public async save(match: Match) {
    const savedMission = await this.saveMission(match);
    return this.addSlots(match);
  }

  private async saveMission(match: Match) {
    this.missionService.save({
      title: 'Einsatz bei Gruppe-Adler',
      slug: match.uuid,
      description: 'Einsatz bei Gruppe Adler - Details im entsprechenden Forenthread :)',
      detailedDescription: `Einsatz bei Gruppe Adler  siehe https://forum.gruppe-adler.de/topic/${this.tid}`,
      briefingTime: this.epochString,
      slottingTime: this.epochString,
      startTime: this.epochString,
      endTime: this.epochString,
      slotsAutoAssignable: true,
      requiredDLCs: ['Apex'],
    });
  }

  private addSlots(match: Match): void {
    this.slotGroupService.migrateSlotGroups(match);
  }
}
