import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  public matchChangedExternal = false;

  public readonly fireteamPreset = {
    preset: true,
    slot: [
      {shortcode: 'FTL', description: 'Fireteam Leader'},
      {shortcode: 'R', description: 'Rifleman'},
      {shortcode: 'R', description: 'Rifleman'},
      {shortcode: 'R', description: 'Rifleman'}
    ]};

  constructor(public router: Router,
              private route: ActivatedRoute,
              public editService: EditService,
              private slottingService: SlottingService) {
  }

  ngOnInit() {
    this.editService.init(this.slottingService.match);
    this.slottingService.matchChanged.subscribe(value => this.matchChangedExternal = value);
  }

  public abort(): void {
    console.log('abort');
    const abort = () => {
      this.router.navigate(['/slotting'], {
        queryParams: {
          tid: this.route.snapshot.queryParams['tid'],
          matchid: this.route.snapshot.queryParams['matchid']
        }
      });
    };
    if (this.editService.matchDirty) {
      console.log(this.editService.rawMatch);
      console.log(this.editService.match);
      this.slottingService.bootboxConfirm('Du hast noch ungespeicherte Änderungen. Möchtest du trotzdem abbrechen?', result => {
        if (result) {
          abort();
        }
      });
    } else {
      abort();
    }
  }

  public async save(): Promise<void> {
    console.log('save');
    if (this.matchChangedExternal) {
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
    if (!this.showSourcecode) {
      this.xml = this.editService.getMatchXml();
    }
    console.log('edit dirty', this.editService.matchDirty);
    const result = await this.editService.updateMatch(this.xml);
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

  onRootDrop(event): void {
    const origin = event.dragData.origin;
    let data = event.dragData.data;
    const type = event.dragData.type;
    if (!data.preset) {
      // remove data from origin
      const index = origin.indexOf(data);
      if (index > -1) {
        origin.slice(index, 1);
      }
    } else {
      data = JSON.parse(JSON.stringify(data));
      delete data.preset;
    }
    this.editService.match[type] = this.editService.match[type] || [];
    this.editService.match[type].push(data);
  }
}
