import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SharedService } from './shared.service';

@Injectable()
export class SharedResolver implements Resolve<any> {
  constructor(private router: Router, private sharedService: SharedService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    if (!(route.queryParams.tid && route.queryParams.matchid && route.queryParams.uuid && route.queryParams.reservation)) {
      this.router.navigate(['/404']);
      return;
    }

    const shareData = await this.sharedService.getShare(route.queryParams.tid, route.queryParams.matchid, route.queryParams.uuid);
    if (shareData && shareData.reservation === route.queryParams.reservation) {
      const match = await this.sharedService.getMatch(route.queryParams.tid, route.queryParams.matchid, route.queryParams.uuid, route.queryParams.reservation);
      if (match) {
        const topic = await this.sharedService.getTopic(route.queryParams.tid, route.queryParams.matchid, route.queryParams.uuid);
        if (topic) {
          return {match, topic, shareData};
        }
      }
    }

    this.router.navigate(['/404']);
    return null;
  }
}
