import {Injectable} from '@angular/core';
import {Mission, Model64, Model93, V1missionsService} from '../../../generated/slotlist-backend';
import {Match} from '../models/match';
import {AuthProviderService} from './auth-provider.service';
import {MissionService} from './mission-service';
import {SlotContainer} from '../models/slotContainer';
import {SelfContainedUnit} from '../models/selfContainedUnit';
import {EventService} from './event-service';

export interface SlotGroupCreate extends Model64 /*title, description, insertAfter*/ {
  parentGroupUid?: string;
  radioFrequency?: string;
  tacticalSymbol?: string;
  vehicle?: string;
  minSlottedPlayerCount?: number;

}
export interface SlotGroupPatch extends Model93 /*title, description, moveAfter*/ {
  parentGroupUid?: string;
  radioFrequency?: string;
  tacticalSymbol?: string;
  vehicle?: string;
  minSlottedPlayerCount?: number;
}

@Injectable()
export class SlotGroupService {
  private tid: number;
  public constructor(
    private v1MissionService: V1missionsService,
    private authService: AuthProviderService,
    private missionService: MissionService,
    private eventService: EventService,
  ) {
    this.tid = eventService.getTid();
  }

  public postSlotGroups(mission: Match) {
    const saveSlotGroup = (c) => {
      this.saveSlotGroup(c, null);
    };
    mission.company.forEach(saveSlotGroup);
    mission.platoon.forEach(saveSlotGroup);
    mission.squad.forEach(saveSlotGroup);
    // this.v1MissionService.postV1MissionsMissionslugSlotgroups(this.authService.getAuthorizationHeader(), mission.uuid, {});
  }

  private async saveSlotGroup(slotContainer: SlotContainer & SelfContainedUnit, parentUid?: string): void {
    const createdSlotGroup = await this.v1MissionService.postV1MissionsMissionslugSlotgroups(
      this.authService.getAuthorizationHeader(),
      {
      parentGroupUid: parentUid,
      radioFrequency: slotContainer.frequency,
      tacticalSymbol: slotContainer.natosymbol,
      vehicle: slotContainer.vehicletype,
      minSlottedPayerCount: slotContainer['min-slotted-player-count']
    });
  }
}

/*


when posting, I need the parent group. so…
* walk the tree from top to bottom, saving things along the way (adding uuids…)
--> uh. do that always for POSTing, dont PATCH here.

so:

- either save xml-stuff to slotlist-backend as a new mission
- OR UPDATE the single items, like a single group, on change.
phew.

how to go about this? might be i should
- first do the migration (extra button to save EVERYTHING is ok)
- then separate code to CRUD all the single thingies



 */
