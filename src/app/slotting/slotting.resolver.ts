import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SlottingService } from './slotting.service';

@Injectable()
export class SlottingResolver implements Resolve<any> {
  constructor(private router: Router, private slottingService: SlottingService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    if (!(route.queryParams.tid && route.queryParams.matchid)) {
      this.router.navigate(['/404']);
      return;
    }

    if (this.slottingService.match) {
      return this.slottingService.match;
    }

    if (await this.slottingService.getMatch(route.queryParams.tid, route.queryParams.matchid)) {
      return this.slottingService.match;
    }

    this.router.navigate(['/404']);
    return null;
  }
}
