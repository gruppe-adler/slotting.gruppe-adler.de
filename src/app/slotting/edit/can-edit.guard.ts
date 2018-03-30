import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { SlottingService } from '../slotting.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class CanEditGuard implements CanActivate {
  constructor(private router: Router, private slottingService: SlottingService) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!(route.queryParams.tid && route.queryParams.matchid)) {
      this.router.navigate(['/404']);
      return false;
    }

    const permissionGranted = environment.ignoreMissingPermissions || (await this.slottingService.getPermissions(route.queryParams.tid)).result;
    if (!permissionGranted) {
      console.log(permissionGranted);
      console.log(route.queryParams);
      this.router.navigate(['/slotting', {queryParams:
        {
          tid: route.queryParams.tid
        }
      }]);
      console.log('permission denied');
      return false;
    }

    return true;
  }
}
