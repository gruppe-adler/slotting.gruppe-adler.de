import {EventService} from './event-service';
import {Injectable} from '@angular/core';
import {MissionCreate} from '../models/slotlist-backend/aliases';
import {
  GetMissionDetailsResponse, MissionDetails,
  V1missionsService
} from '../../../generated/slotlist-backend';
import {AuthProviderService} from './auth-provider.service';

const communitySlug = 'grad';

@Injectable()
export class MissionService {
  private tid: number;

  public constructor(
    private v1missionsService: V1missionsService,
    private authProviderService: AuthProviderService,
    private eventService: EventService
  ) {
    this.tid = eventService.getTid();
  }

  public getMissionSlug(matchIndex: number): string {
    return [communitySlug, this.tid, matchIndex].join('-');
  }

  public async save(mission: MissionCreate, matchIndex: number): Promise<MissionDetails> {
    const slug = this.getMissionSlug(matchIndex);
    const authorization = this.authorization();

    mission.slug = slug;

    const response = await this.v1missionsService.getV1MissionsSlugavailable(slug).toPromise();
    if (response.available) {
      const createResponse = await this.v1missionsService.postV1Missions(authorization, mission).toPromise();
      this.authProviderService.updateToken(createResponse.token);
      return createResponse.mission;
    } else {
      const updateResponse = await this.v1missionsService.patchV1MissionsMissionslug(authorization, slug, mission).toPromise();
      return updateResponse.mission;
    }
  }

  public async load(matchIndex: number): Promise<MissionDetails> {
    const slug = this.getMissionSlug(matchIndex);
    const missionDetails: GetMissionDetailsResponse = await this.v1missionsService
      .getV1MissionsMissionslug(slug, this.authorization())
      .toPromise();

    return missionDetails.mission;
  }

  private authorization(): string {
    return this.authProviderService.getAuthorizationHeader();
  }
}
