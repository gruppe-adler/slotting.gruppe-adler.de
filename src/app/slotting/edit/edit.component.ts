import { Component, OnInit } from '@angular/core';
import { SlottingService } from '../slotting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditService } from './edit.service';
import { NodeComponent } from './components/node.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public xml = '';
  public showSourcecode = false;
  public matchChangedExternal = false;
  public readonly environment = environment;
  public readonly localStorage = localStorage;

  private dragClientY = 0;
  private isScrolling = false;

  public readonly fireteamPreset = {
    preset: true,
    slot: [
      {shortcode: 'FTL', description: 'Fireteam Leader'},
      {shortcode: 'R', description: 'Rifleman'},
      {shortcode: 'R', description: 'Rifleman'},
      {shortcode: 'R', description: 'Rifleman'}
    ]
  };

  constructor(public router: Router,
              private route: ActivatedRoute,
              public editService: EditService,
              public slottingService: SlottingService) {
  }

  ngOnInit() {
    this.slottingService.findMatch(this.route.snapshot.queryParams['tid'], this.route.snapshot.queryParams['matchid']).then(result => {
      this.editService.init(result);
    });
    this.slottingService.matchChanged.subscribe(value => this.matchChangedExternal = value);

    document.addEventListener('dragover', this.dragover);
  }

  dragover(e): void {
    console.log('over');
    this.dragClientY = e.screenY;
    console.log(e, document.documentElement.clientHeight, window.outerHeight);

    if (this.isScrolling) {
      return;
    }

    const scroll = () => {
      if (!NodeComponent.isDragging) {
        this.isScrolling = false;
        return;
      }

      if (this.dragClientY > window.outerHeight - 200) {
        console.log('scroll down');
        window.parent.postMessage({
          type: 'windowScrollBy',
          data: {
            x: 0,
            y: 5
          }
        }, '*');
      } else if (this.dragClientY < 300) {
        console.log('scroll up');
        window.parent.postMessage({
          type: 'windowScrollBy',
          data: {
            x: 0,
            y: -5
          }
        }, '*');
      }
      setTimeout(scroll, 10);
    };
    this.isScrolling = true;
    scroll();
  }

  public abort(): void {
    console.log('abort');
    const abort = () => {
      this.router.navigate(['/slotting'], {
        queryParams: {
          tid: this.route.snapshot.queryParams['tid']
        }
      });
    };
    if (this.editService.matchDirty) {
      console.log(this.editService.rawMatch);
      console.log(this.editService.match);
      this.slottingService.bootboxConfirm('Du hast noch ungespeicherte Änderungen. Möchtest du trotzdem abbrechen?').then(result => {
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
      const result = await this.slottingService.bootboxConfirm('Die Slotliste hat sich während der Bearbeitung verändert. Möchtest du die Änderungen überschreiben?');
      if (result) {
        this.saveInternal();
      }
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
        origin.splice(index, 1);
      }
    } else {
      data = JSON.parse(JSON.stringify(data));
      delete data.preset;
    }
    this.editService.match[type] = this.editService.match[type] || [];
    this.editService.match[type].push(data);
  }

  public onDragEnter(event): void {
    this.editService.updateHighlightedContainer(event.target);
  }
  public onDragLeave(event): void {
    this.editService.removeHighlightedContainer(event.target);
  }
}
