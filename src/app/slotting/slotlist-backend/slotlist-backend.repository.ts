import {Match} from '../models/match';
import {V1missionsService} from '../../../generated/slotlist-backend';
import {Observable} from 'rxjs';
import {EventService} from './event-service';
import {AuthProviderService} from './auth-provider.service';
import {Injectable} from '@angular/core';

const communitySlug = 'grad';

@Injectable()
export class SlotlistBackendRepository {
  private tid: number;

  public constructor(
    private v1missionsService: V1missionsService,
    private authProviderService: AuthProviderService,
    private eventService: EventService,
  ) {
    this.tid = eventService.getTid();
  }

  public save(match: Match): Observable<boolean> {
    // window.console.info('MATCH MODEL:');
    // window.console.info(JSON.stringify(match, null, '\t'));
    const observable = Observable.create();

    this.v1missionsService.getV1MissionsSlugavailable(this.getMissionSlug()).subscribe((response) => {
      if (response.available) {
        this.v1missionsService.postV1Missions(this.authProviderService.getAuthorizationHeader(), {
          title: 'Gruppe Adler mission',
          slug: this.getMissionSlug(),
          description: 'totally awesome scenario',
          detailedDescription: 'Gruppe Adler mission',
          briefingTime: '2018-08-18T17:30:00.000Z',
          slottingTime: '2018-08-18T17:45:00.000Z',
          startTime: '2018-08-18T18:00:00.000Z',
          endTime: '2018-08-18T21:00:00.000Z',
          slotsAutoAssignable: false,
          requiredDLCs: ['apex'],
        }).subscribe(() => this.addSlots(match));
      } else {
        this.addSlots(match);
        observable.next(true);
      }
    });

    return ;
  }

  private addSlots(match: Match): void {
    // this.tid
  }

  private getMissionSlug(): string {
    return [communitySlug, this.tid].join('-');
  }
}
