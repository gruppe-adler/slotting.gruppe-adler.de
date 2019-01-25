import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnInit,
  ViewChild
} from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { EditService } from '../edit.service';
import { SlottingService } from '../../slotting.service';

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

  constructor(private elementRef: ElementRef,
              private cdr: ChangeDetectorRef,
              private editService: EditService,
              public slottingService: SlottingService) {
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

    const inputShortcode = this.elementRef.nativeElement.getElementsByTagName('input');
    if (inputShortcode['shortcode']) {
      setTimeout(() => {
        inputShortcode['shortcode'].select();
      }, 100);
    }

    if (this.toolbarExpanded) {
      const element = this.elementRef.nativeElement.getElementsByClassName('tools')[0];
      const bounding = element.getBoundingClientRect();
      if (bounding.x < 0) {
        console.log('fix');
        element.style.left = -bounding.x + 5 + 'px';
      }
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

    var shiftPressed = event.shiftKey;
    console.log(shiftPressed);

    switch (this.slot.shortcode) {
        case 'CMD': this.slot.description = 'Commander';
        this.cdr.detectChanges();
        break;

        case 'CA': this.slot.description = 'Command Assistant';
        this.cdr.detectChanges();
        break;

        case 'SQL': this.slot.description = 'Squad Leader';
        this.cdr.detectChanges();
        break;

        case 'SQM': this.slot.description = 'Squad Medic';
        this.cdr.detectChanges();
        break;

        case 'MG': this.slot.description = 'Machine Gunner';
        this.cdr.detectChanges();
        break;

        case 'AT': this.slot.description = 'AT Gunner';
        this.cdr.detectChanges();
        break;

        case 'MED': this.slot.description = 'Medic';
        this.cdr.detectChanges();
        break;

        case 'R': this.slot.description = 'Rifleman';
        this.cdr.detectChanges();
        break;
    }

    
      this.checkNeededValues();
      this.toolbarExpanded = false;
       event.stopPropagation();
       event.preventDefault();

       var currentSlot = this.elementRef.nativeElement.getElementsByClassName('avatar ng-star-inserted')[0];
       var slotHTMLCollection = currentSlot.getRootNode().getElementsByClassName('avatar ng-star-inserted');// this.elementRef.nativeElement.parentNode.getElementsByClassName('avatar');
       var slotArray = Array.from(slotHTMLCollection);
       var slotArrayLength = slotArray.length;
       var index = slotArray.indexOf(currentSlot);
       var addValue = shiftPressed ? -1 : 1;
       var resultIndex = 0;

       if (!shiftPressed) {
         if (index < (slotArrayLength-5)) {
            resultIndex = index + addValue;
           
         } else {
          resultIndex =0;
         }
       } else {
         if (index < 1) {
            resultIndex = (slotArrayLength-6);
         } else {
            resultIndex = index + addValue;
         }
       }

       console.log(resultIndex);

        slotHTMLCollection[resultIndex].click();
            slotHTMLCollection[resultIndex].scrollIntoView({
              behavior: 'auto',
              block: 'center',
              inline: 'center'
          });
      // console.log(index + " " + slotArrayLength);
    
  
  

  public checkNeededValues(): void {
    this.slot.description = !this.slot.description || this.slot.description === '' ? 'Rifleman' : this.slot.description;
    this.slot.shortcode = !this.slot.shortcode || this.slot.shortcode === '' ? 'R' : this.slot.shortcode;
  }
}
