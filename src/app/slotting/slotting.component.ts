import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SlottingService } from './slotting.service';

@Component({
  templateUrl: './slotting.component.html',
  styleUrls: ['./slotting.component.scss']
})
export class SlottingComponent implements OnInit {
  public canAdministrate = false;

  constructor(public route: ActivatedRoute, public slottingService: SlottingService) {
  }

  ngOnInit(): void {
    this.slottingService.getPermissions().then(result => {
      if (result.result) {
        this.canAdministrate = true;
      }
    });
  }

  deleteMatch(): void {
    this.slottingService.bootboxConfirm('Slotliste ' + this.slottingService.matchid + ' wirklich löschen?', result => {
      if (result) {
        console.log('delete');
      }
    });
  }
}
