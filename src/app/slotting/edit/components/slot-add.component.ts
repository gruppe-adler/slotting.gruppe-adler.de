import { Component, Input, OnInit } from '@angular/core';
import { EditService } from '../edit.service';

@Component({
  templateUrl: './slot-add.component.html',
  styleUrls: ['../../slot.component.scss', './slot-add.component.scss'],
  selector: 'app-edit-slot-add'
})
export class SlotAddComponent implements OnInit {
  @Input() context: any;

  constructor(private editService: EditService) {
  }

  public ngOnInit(): void {

  }

  public onClick(): void {
    this.context.slot = this.context.slot || [];
    this.context.slot.push(this.editService.defaultSlot);
  }
}
