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
import {Slot} from '../models/slot';

export interface SlotGroupCreate extends Model64 /*title, description, insertAfter*/
{
  parentGroupUid?: string;
  radioFrequency?: string;
  tacticalSymbol?: string;
  vehicle?: string;
  minSlottedPlayerCount?: number;

}

export interface SlotGroupPatch extends Model93 /*title, description, moveAfter*/
{
  parentGroupUid?: string;
  radioFrequency?: string;
  tacticalSymbol?: string;
  vehicle?: string;
  minSlottedPlayerCount?: number;
}

class SlotGroupContext {
  public constructor(
    public readonly action: SlotGroupSavingAction,
    public readonly parentUid: string | null,
    public readonly slotContainer: SlotContainer & SelfContainedUnit,
  ) {
  }
}

class SlotGroupSavingAction {
  private insertAfter = 0;

  public constructor(public readonly missionSlug: string) {
  }

  public nextInsertAfter(): number {
    this.insertAfter += 1;

    return this.insertAfter;
  }
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
      this.saveSlotGroup(new SlotGroupContext(new SlotGroupSavingAction(mission.uuid), null, c));
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
      slotGroupContext.action.missionSlug,
      {
        title: slotContainer.callsign,
        description: slotContainer.callsign, // TODO
        parentGroupUid: slotGroupContext.parentUid,
        radioFrequency: slotContainer.frequency,
        tacticalSymbol: slotContainer.natosymbol,
        vehicle: slotContainer.vehicletype,
        minSlottedPlayerCount: slotContainer['min-slotted-player-count'],
        insertAfter: slotGroupContext.action.nextInsertAfter(),
      });

    const saveSlotGroup = (c) => {
      this.saveSlotGroup(new SlotGroupContext(
        slotGroupContext.action,
        createdSlotGroup.slotGroup.uid,
        c,
      ));
    };

    const saveSlot = (s: Slot) => {
      this.v1MissionService.postV1MissionsMissionslugSlots(
        this.authService.getAuthorizationHeader(),
        slotGroupContext.action.missionSlug,
        [{
          slotGroupUid: createdSlotGroup.slotGroup.uid,
          title: s.shortcode,
          difficulty: 0,
          description: s.description,
          // restrictedCommunityUid?: string;
          reserve: false,
          blocked: false,
          autoAssignable: true,
          requiredDLCs: [],
          insertAfter: 0,
          duplicate: false,
        }]);
    };

    ((slotGroupContext.slotContainer as Company).platoon || []).forEach(saveSlotGroup);
    ((slotGroupContext.slotContainer as Company).squad || []).forEach(saveSlotGroup);
    (slotGroupContext.slotContainer.slot || []).forEach(saveSlot);
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
