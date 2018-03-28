import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SlottingService } from './slotting.service';

@Injectable()
export class SlottingResolver implements Resolve<any> {
  constructor(private router: Router, private slottingService: SlottingService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    if (!route.queryParams.tid) {
      this.router.navigate(['/404']);
      return;
    }

    if (!this.slottingService.matches || this.slottingService.matches.length === 0) {
      return await this.slottingService.getMatches(route.queryParams.tid);
    }

    return this.slottingService.matches;
  }
}
