import {MissionCreate} from '../models/slotlist-backend/aliases';
import {Injectable} from '@angular/core';

@Injectable()
export class SlugGeneratorService {
  private prefix = 'grad';
  public createSlug(missionCreate: MissionCreate): string {
    const date = new Date(missionCreate.startTime);
    const bits: (string | number)[] = [this.prefix, date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes()];

    return bits.join('_');
  }
}
