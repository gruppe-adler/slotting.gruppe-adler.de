import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: './slot.component.html',
  styleUrls: ['../../slot.component.scss'],
  selector: 'app-edit-slot'
})
export class SlotComponent implements OnInit {
  @Input() slot: any;
  @Input() isFireteam = false;
  @Input() reservation = '';

  constructor() {
  }

  public ngOnInit(): void {

  }
}
