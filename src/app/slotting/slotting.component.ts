import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SlottingService } from './slotting.service';

@Component({
  templateUrl: './slotting.component.html',
  styleUrls: ['./slotting.component.scss']
})
export class SlottingComponent {
  constructor(public route: ActivatedRoute, public slottingService: SlottingService) {
    if (!route.snapshot.queryParams.tid || !route.snapshot.queryParams.matchid) {
      return;
    }

    slottingService.getMatch(route.snapshot.queryParams.tid, route.snapshot.queryParams.matchid);
  }
}
