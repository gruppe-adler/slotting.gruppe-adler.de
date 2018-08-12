import {Injectable} from '@angular/core';
import {Mission, V1missionsService} from '../../../generated/slotlist-backend';
import {Match} from '../models/match';

@Injectable()
export class SlotGroupService {
  public constructor(private v1MissionService: V1missionsService) {
  }

  public postSlotGroups(mission: Match) {

  }

  private extractSlotGroupsFromMatch(match: Match) {

  }
}
