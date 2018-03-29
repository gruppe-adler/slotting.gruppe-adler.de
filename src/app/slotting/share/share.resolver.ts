import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ShareService } from './share.service';

@Injectable()
export class ShareResolver implements Resolve<any> {
  constructor(private shareService: ShareService, private router: Router) {}

  public async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    if (!(route.queryParams.tid && route.queryParams.matchid)) {
      this.router.navigate(['/404']);
      return null;
    }

    const result = this.shareService.getShares(route.queryParams.tid, route.queryParams.matchid);
    if (!result) {
      this.router.navigate(['/404']);
      return null;
    }

    return result;
  }
}
