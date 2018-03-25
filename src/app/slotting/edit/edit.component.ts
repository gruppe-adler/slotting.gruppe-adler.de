import { Component, OnInit } from '@angular/core';
import { SlottingService } from '../slotting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from './edit.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public xml = '';
  public showSourcecode = false;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private editService: EditService,
              private slottingService: SlottingService) { }

  ngOnInit() {
    this.slottingService.getPermissions().then(data => console.log(data));
  }

  public abort(): void {
    this.router.navigate(['/slotting'], {
      queryParams: {
        tid: this.route.snapshot.queryParams['tid'],
        matchid: this.route.snapshot.queryParams['matchid']
      }
    });
  }

  public async save(): Promise<void> {
    const result = await this.slottingService.updateMatch(this.xml);
    if (result) {
      this.abort();
    } else {
      this.slottingService.bootbox('Das ging schief.');
    }
  }

  public toggleSourcediting(): void {
    this.showSourcecode = !this.showSourcecode;
    if (this.showSourcecode) {
      this.xml = this.editService.getMatchXml();
    } else {
      this.editService.updateMatchFromXml(this.xml);
    }
  }
}
