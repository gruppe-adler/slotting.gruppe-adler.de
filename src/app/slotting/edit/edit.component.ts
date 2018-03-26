import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SlottingService } from '../slotting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from './edit.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public xml = '';
  public showSourcecode = false;
  public matchChanged = false;

  public readonly templates = [
    { type: 'platoon', id: 0, name: 'Platoon' },
    { type: 'company', id: 1, name: 'Company' },
    { type: 'squad', id: 2, name: 'Squad' },
    { type: 'fireteam', id: 3, name: 'Fireteam' }
  ];
  public selectedItem: any;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private editService: EditService,
              private slottingService: SlottingService,
              private dragulaService: DragulaService) {
    dragulaService.setOptions('items-bag', {
      copy: true,
      accepts: (el, target, source, sibling) => {
        const targetType = target.id;
        const elementType = source.id;
        if (targetType === 'company-container') {
          return true;
        }
        return false;
      }
    });

    dragulaService.drop.subscribe((value) => {
      console.log('drop:', value);
    });

    dragulaService.dropModel.subscribe((bagName, el, target, source) => {
      console.log('drop:', bagName, el, target, source);
    });
  }

  ngOnInit() {
    this.editService.match = this.slottingService.match;
    this.slottingService.matchChanged.subscribe(() => this.matchChanged = true);
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
    if (this.matchChanged) {
      this.slottingService.bootboxConfirm('Die Slotliste hat sich während der Bearbeitung verändert. Möchtest du die Änderungen überschreiben?', result => {
        if (result) {
          this.saveInternal();
        }
      });
      return;
    }
    this.saveInternal();
  }

  private async saveInternal(): Promise<void> {
    const result = await this.slottingService.updateMatch(this.xml);
    if (result) {
      this.abort();
    } else {
      this.slottingService.bootbox('Das ging schief.');
    }
  }

  public toggleSourceediting(): void {
    this.showSourcecode = !this.showSourcecode;
    if (this.showSourcecode) {
      this.xml = this.editService.getMatchXml();
    } else {
      this.editService.updateMatchFromXml(this.xml);
    }
  }
}
