import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { SlottingService } from '../slotting.service';

@Injectable()
export class CanEditGuard implements CanActivate {
  constructor(private router: Router, private slottingService: SlottingService) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!(route.queryParams.tid && route.queryParams.matchid)) {
      this.router.navigate(['/404']);
      return false;
    }

    const permissionGranted = await this.slottingService.getPermissions(route.queryParams.tid);
    if (!permissionGranted || !permissionGranted.result) {
      console.log(permissionGranted);
      console.log(route.queryParams);
      this.router.navigate(['/slotting', {queryParams:
        {
          tid: route.queryParams.tid,
          matchid: route.queryParams.matchid
        }
      }]);
      console.log('permission denied');
      return false;
    }

    return true;
  }
}
