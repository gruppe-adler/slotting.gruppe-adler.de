import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnInit,
  ViewChild
} from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { EditService } from '../edit.service';

@Component({
  templateUrl: './slot.component.html',
  styleUrls: ['../../slot.component.scss', './slot.component.scss'],
  selector: 'app-edit-slot',
  animations: [
    trigger('toolbarState', [
      transition('1 => 0', [
        style({
          backgroundColor: 'white'
        }),
        animate('250ms ease-in', style({
          backgroundColor: '#d9d9d9'
        }))
      ])
    ]),
    trigger('newSlotAnimation', [
      transition('* => 1', [
        style({
          transform: 'scaleX(0)',
          opacity: 0
        }),
        animate('500ms ease-in', keyframes([
          style({transform: 'scaleX(1)', offset: 0.5}),
          style({opacity: 1, offset: 1})
        ]))
      ])
    ])
  ]
})
export class SlotComponent implements OnInit, AfterViewInit {
  @Input() slot: any;
  @Input() context: any;
  @Input() isFireteam = false;
  @Input() reservation = '';
  @ViewChild('toolbar') toolbar: ElementRef;
  @HostBinding('@newSlotAnimation') public newSlot = false;

  public toolbarExpanded = false;
  public initialized = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef, private editService: EditService) {
  }

  public ngOnInit(): void {
    if (this.slot.newSlot) {
      this.newSlot = true;
    }
    this.checkNeededValues();
  }

  public ngAfterViewInit(): void {
    if (this.slot.newSlot) {
      setTimeout(() => this.onClick(), 250);
      delete this.slot.newSlot;
    }
    this.initialized = true;
    this.cdr.detectChanges();
  }

  public onClick(): void {
    if (this.context.preset) {
      return;
    }
    this.toolbarExpanded = !this.toolbarExpanded;
    this.cdr.detectChanges();
    this.checkNeededValues();

    const inputs = this.elementRef.nativeElement.getElementsByTagName('input');
    if (inputs['description']) {
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
        this.checkNeededValues();
      }
    } else if (ev['target'] && this.toolbar) {
      const elements = this.toolbar.nativeElement.getElementsByTagName('*');
      let found = false;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i] === ev['target'] && elements[i] !== this.elementRef.nativeElement.firstElementChild.firstElementChild) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.toolbarExpanded = false;
        this.checkNeededValues();
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
      this.context.slot.splice(index, 1);
    }
  }

  public onKey(event): void {
    if (event.keyCode === 13) {
      this.toolbarExpanded = false;
      this.checkNeededValues();
    }
  }

  public checkNeededValues(): void {
    this.slot.description = !this.slot.description || this.slot.description === '' ? 'Rifleman' : this.slot.description;
    this.slot.shortcode = !this.slot.shortcode || this.slot.shortcode === '' ? 'R' : this.slot.shortcode;
  }
}
