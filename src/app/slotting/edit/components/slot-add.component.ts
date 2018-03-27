import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: './slot-add.component.html',
  styleUrls: ['../../slot.component.scss', './slot-add.component.scss'],
  selector: 'app-edit-slot-add'
})
export class SlotAddComponent implements OnInit {
  @Input() context: any;

  constructor() {
  }

  public ngOnInit(): void {

  }
}
