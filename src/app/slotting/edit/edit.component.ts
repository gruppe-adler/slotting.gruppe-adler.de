import { Component, OnInit } from '@angular/core';
import { SlottingService } from '../slotting.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public xml = '';

  constructor(public router: Router,
              private route: ActivatedRoute,
              private slottingService: SlottingService) { }

  ngOnInit() {
    this.xml = this.slottingService.getMatchXml();
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

    } else {

    }
  }
}
