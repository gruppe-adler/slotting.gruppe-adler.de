import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { SlottingService } from './slotting.service';
import { enterView } from '@angular/core/src/render3/instructions';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './slotting.component.html',
  styleUrls: ['./slotting.component.scss']
})
export class SlottingComponent implements OnInit {
  public canAdministrate = false;
  public showGroupColorSwitch = false;
  public groupColorSwitch = false;

  constructor(public route: ActivatedRoute, public slottingService: SlottingService) {
  }

  ngOnInit(): void {
    this.slottingService.getPermissions().then(result => {
      if (result.result) {
        this.canAdministrate = true;
      }
    });

    if (window.parent) {
      if (!window.parent['slottingGroupColorSwitch']) {
        window.parent['slottingGroupColorSwitch'] = true;
        this.showGroupColorSwitch = true;
      }
    } else {
      this.showGroupColorSwitch = true;
    }
    const groupColorSwitchValue = localStorage.getItem(environment.storageKeys.showGroupColor) || 'false';
    this.groupColorSwitch = groupColorSwitchValue === 'true';
    this.slottingService.showGroupsChanged.subscribe(value => this.groupColorSwitch = value);
  }

  deleteMatch(): void {
    this.slottingService.bootboxConfirm('Slotliste ' + this.slottingService.matchid + ' wirklich löschen?', result => {
      if (result) {
        console.log('delete');
        this.slottingService.deleteMatch().then(deleteResult => {
          if (deleteResult) {
            location.reload();
          } else {
            this.slottingService.bootbox('Das ging schief :(');
          }
        });
      }
    });
  }
}
