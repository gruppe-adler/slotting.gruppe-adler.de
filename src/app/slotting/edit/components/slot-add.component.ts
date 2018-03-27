import { Component, Input, OnInit } from '@angular/core';
import { EditService } from '../edit.service';

@Component({
  templateUrl: './slot-add.component.html',
  styleUrls: ['../../slot.component.scss', './slot-add.component.scss'],
  selector: 'app-edit-slot-add'
})
export class SlotAddComponent implements OnInit {
  @Input() context: any;
  @Input() type: string;

  constructor(private editService: EditService) {
  }

  public ngOnInit(): void {

  }

  public onClick(): void {
    this.context.slot = this.context.slot || [];

    let slot = this.editService.defaultSlot;

    if (this.context.slot.length === 0) {
      switch (this.type) {
        case 'company': {
          slot = this.editService.firstCompanySlot;
        } break;

        case 'platoon': {
          slot = this.editService.firstPlatoonSlot;
        } break;

        case 'squad': {
          slot = this.editService.firstSquadSlot;
        } break;

        case 'fireteam': {
          slot = this.editService.firstFireteamSlot;
        } break;
      }
    }

    this.context.slot.push(slot);
  }
}
