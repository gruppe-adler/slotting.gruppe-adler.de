import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './slot.component.html',
  styleUrls: ['../../slot.component.scss', './slot.component.scss'],
  selector: 'app-edit-slot'
})
export class SlotComponent implements AfterViewInit {
  @Input() slot: any;
  @Input() isFireteam = false;
  @Input() reservation = '';

  public toolbarOffset = 0;
  public toolbarExpanded = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    if (this.slot.newSlot) {
      this.onClick();
      console.log('1223');
      delete this.slot.newSlot;
    }
  }

  public onClick(): void {
    this.toolbarOffset = this.elementRef.nativeElement.firstElementChild.firstElementChild.clientWidth;
    console.log(this.toolbarOffset);
    this.toolbarExpanded = !this.toolbarExpanded;
    this.cdr.detectChanges();
  }

  @HostListener('document:mouseup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    const elements = this.elementRef.nativeElement.getElementsByClassName('avatar');
    if (elements[0] !== ev.srcElement) {
      this.toolbarExpanded = false;
    }
  }
}
