import { Component, OnInit } from '@angular/core';
import { SlottingService } from './slotting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './overview.component.html',
  styleUrls: ['./overview-component.scss']
})
export class OverviewComponent implements OnInit {
  public groupColorSwitch = false;
  constructor(public slottingService: SlottingService, public router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    const groupColorSwitchValue = localStorage.getItem(environment.storageKeys.showGroupColor) || 'false';
    this.groupColorSwitch = groupColorSwitchValue === 'true';
    this.slottingService.showGroupsChanged.subscribe(value => this.groupColorSwitch = value);
  }

  public async createMatch(): Promise<void> {
    const result = await this.slottingService.createMatch();
    if (result !== '') {
      this.router.navigate(['edit'], {relativeTo: this.route, queryParams: {
          tid: this.slottingService.tid,
          matchid: result
        }});
    } else {
      this.slottingService.bootbox('Das ging schief :(');
    }
  }

  public isInIframe(): boolean {
    return window !== window.parent;
  }

  public openInNewTab(): void {
    window.open(window.location.href, '_blank');
  }
}
