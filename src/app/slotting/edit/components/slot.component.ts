import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild('toolbar') toolbar: ElementRef;

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
    if (this.context.preset) {
      return;
    }
    this.toolbarOffset = this.elementRef.nativeElement.firstElementChild.firstElementChild.clientWidth;
    this.toolbarExpanded = !this.toolbarExpanded;
    this.cdr.detectChanges();

    const inputs = this.elementRef.nativeElement.getElementsByTagName('input');
    if (inputs['description']) {
      console.log(inputs['description']);
      setTimeout(() => {
        inputs['description'].select();
      }, 100);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev['path']) {
      if (ev['path'].indexOf(this.elementRef.nativeElement) === -1) {
        this.toolbarExpanded = false;
      }
    } else if (ev['target'] && this.toolbar) {
      const elements = this.toolbar.nativeElement.getElementsByTagName('*');
      let found = false;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i] === ev['target'] && elements[i] !== this.elementRef.nativeElement.firstElementChild.firstElementChild) {
          found = true;
        }
      }
      if (!found) {
        this.toolbarExpanded = false;
      }
    }
  }

  public duplicate(): void {
    const index = this.context.slot.indexOf(this.slot);
    if (index > -1) {
      const duplicate = JSON.parse(JSON.stringify(this.slot));
      delete duplicate.uuid;
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

  public onKey(event): void {
    console.log(event);
    if (event.keyCode === 13) {
      this.toolbarExpanded = false;
    }
  }
}
