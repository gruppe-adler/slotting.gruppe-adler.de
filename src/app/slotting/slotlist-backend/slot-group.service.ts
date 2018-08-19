import {Injectable} from '@angular/core';
import {CreateMissionSlotGroupResponse, Mission, Model64, Model93, V1missionsService} from '../../../generated/slotlist-backend';
import {Match} from '../models/match';
import {AuthProviderService} from './auth-provider.service';
import {MissionService} from './mission-service';
import {SlotContainer} from '../models/slotContainer';
import {SelfContainedUnit} from '../models/selfContainedUnit';
import {EventService} from './event-service';
import {Company} from '../models/company';
import {Squad} from '../models/squad';
import {Platoon} from '../models/platoon';

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

interface SlotGroupContext {
  parentUid: string|null;
  missionSlug: string;
  slotContainer: SlotContainer & SelfContainedUnit;
  nextInsertAfter: number;
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
      this.saveSlotGroup({slotContainer: c, parentUid: null, missionSlug: mission.uuid, nextInsertAfter: 0});
    };
    mission.company.forEach(saveSlotGroup);
    mission.platoon.forEach(saveSlotGroup);
    mission.squad.forEach(saveSlotGroup);
    // this.v1MissionService.postV1MissionsMissionslugSlotgroups(this.authService.getAuthorizationHeader(), mission.uuid, {});
  }

  private async saveSlotGroup(slotGroupContext: SlotGroupContext): Promise<void> {
    const slotContainer = slotGroupContext.slotContainer;
    const createdSlotGroup: CreateMissionSlotGroupResponse = await this.v1MissionService.postV1MissionsMissionslugSlotgroups(
      this.authService.getAuthorizationHeader(),
      slotGroupContext.missionSlug,
      {
        title: slotContainer.callsign,
        description: slotContainer.callsign, // TODO
      parentGroupUid: slotGroupContext.parentUid,
      radioFrequency: slotContainer.frequency,
      tacticalSymbol: slotContainer.natosymbol,
      vehicle: slotContainer.vehicletype,
      minSlottedPlayerCount: slotContainer['min-slotted-player-count'],
        insertAfter: slotGroupContext.nextInsertAfter, // TODO does that work?
    });
    slotGroupContext.nextInsertAfter += 1;

    ((slotGroupContext.slotContainer as Company).platoon || []).forEach((c) => {
      this.saveSlotGroup({slotContainer: c, parentUid: createdSlotGroup.slotGroup.uid, missionSlug: slotGroupContext.missionSlug, nextInsertAfter: slotGroupContext.nextInsertAfter});
    })
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
