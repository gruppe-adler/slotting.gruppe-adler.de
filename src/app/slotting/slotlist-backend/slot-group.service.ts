import {Injectable} from '@angular/core';
import {Mission, Model64, Model93, V1missionsService} from '../../../generated/slotlist-backend';
import {Match} from '../models/match';
import {AuthProviderService} from './auth-provider.service';
import {MissionService} from './mission-service';

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
  public constructor(
    private v1MissionService: V1missionsService,
    private authService: AuthProviderService,
    private missionService: MissionService
  ) {
  }

  public postSlotGroups(mission: Match) {
    this.v1MissionService.postV1MissionsMissionslugSlotgroups(this.authService.getAuthorizationHeader(), mission.uuid, {});
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
