import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './slot.component.html',
  styleUrls: ['../../slot.component.scss', './slot.component.scss'],
  selector: 'app-edit-slot'
})
export class SlotComponent implements OnInit, AfterViewInit {
  @Input() slot: any;
  @Input() context: any;
  @Input() isFireteam = false;
  @Input() reservation = '';

  public toolbarOffset = 0;
  public toolbarExpanded = false;
  public initialized = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    this.slot.description = this.slot.description || '';
    this.slot.shortcode = this.slot.shortcode || '';
  }

  public ngAfterViewInit(): void {
    if (this.slot.newSlot) {
      this.onClick();
      delete this.slot.newSlot;
    }
    this.initialized = true;
    this.cdr.detectChanges();
  }

  public onClick(): void {
    this.toolbarOffset = this.elementRef.nativeElement.firstElementChild.firstElementChild.clientWidth;
    console.log(this.toolbarOffset);
    this.toolbarExpanded = !this.toolbarExpanded;
    this.cdr.detectChanges();
  }

  @HostListener('document:mouseup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev['path'].indexOf(this.elementRef.nativeElement) === -1) {
      this.toolbarExpanded = false;
    }
  }

  public duplicate(): void {
    const index = this.context.slot.indexOf(this.slot);
    if (index > -1) {
      const duplicate = JSON.parse(JSON.stringify(this.slot));
      this.context.slot.splice(index, 0, duplicate);
    }
  }

  public deleteSlot(): void {
    const index = this.context.slot.indexOf(this.slot);
    if (index > -1) {
      console.log(index);
      this.context.slot.splice(index, 1);
    }
  }
}
