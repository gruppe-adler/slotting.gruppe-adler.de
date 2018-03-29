import { Component, OnInit } from '@angular/core';
import { SlottingService } from './slotting.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview-component.scss']
})
export class OverviewComponent implements OnInit {
  public groupColorSwitch = false;
  constructor(public slottingService: SlottingService, public route: ActivatedRoute) {}

  public ngOnInit(): void {
    const groupColorSwitchValue = localStorage.getItem(environment.storageKeys.showGroupColor) || 'false';
    this.groupColorSwitch = groupColorSwitchValue === 'true';
    this.slottingService.showGroupsChanged.subscribe(value => this.groupColorSwitch = value);
  }
}
