import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { EditService } from '../edit.service';

@Component({
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  selector: 'app-edit-context-menu',
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
    ])
  ]
})
export class ContextMenuComponent implements OnInit, AfterViewInit {
  @Input() context: any;
  @Input() element: any;
  @Input() type: string;

  public toolbarExpanded = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef, public editService: EditService) {
  }

  public ngOnInit(): void {
    this.checkNeededValues();
    this.elementRef.nativeElement.parentElement.addEventListener('click', () => {
      this.onClick();
    });
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public onClick(): void {
    if (this.element.preset || this.toolbarExpanded) {
      return;
    }
    this.toolbarExpanded = true;
    this.cdr.detectChanges();
    this.checkNeededValues();

    const inputs = this.elementRef.nativeElement.getElementsByTagName('input');
    if (inputs['callsign']) {
      setTimeout(() => {
        inputs['callsign'].select();
      }, 100);
    }

    const element = this.elementRef.nativeElement.getElementsByClassName('tools')[0];
    const bounding = element.getBoundingClientRect();
    if (bounding.x < 0) {
      element.style.left = -bounding.x + 5 + 'px';
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev['path']) {
      if (ev['path'].indexOf(this.elementRef.nativeElement) === -1) {
        this.toolbarExpanded = false;
        this.checkNeededValues();
      }
    } else if (ev['target']) {
      const elements = this.elementRef.nativeElement.getElementsByTagName('*');
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
    this.context[this.type].push(JSON.parse(JSON.stringify(this.element)));
  }

  public delete(): void {
    const index = this.context[this.type].indexOf(this.element);
    if (index > -1) {
      this.context[this.type].splice(index, 1);
    }
  }

  public onKey(event): void {
    if (event.keyCode === 13) {
      this.toolbarExpanded = false;
      this.checkNeededValues();
    }
  }

  //changes focus from ul onto li with current natosymbol
  public onFocusFlagSelect(event): void {
    var list = event.target.getElementsByTagName("ul")[0].getElementsByTagName("li");

    for (var i=0; i<list.length; i++) {
      var element = list[i];
      if (list[i].getElementsByTagName("div")[0].getAttribute("ng-reflect-ng-class") == this.element.natosymbol) {
        list[i].focus();
      }
    }
  }

  //changes focus to next / previous li
  public onKeyFlagSelect(event, direction): void {

    var newTarget = null;
    if (direction == 'down') {
      newTarget = event.target.nextElementSibling;
    } else {
      newTarget = event.target.previousElementSibling ;
    }

    if (newTarget == null) {
      newTarget = event.target;
    }

    newTarget.focus();

    event.preventDefault();
  }


  public setFlag(flag: string): void {
    this.element.natosymbol = flag;
  }

  public checkNeededValues(): void {
    this.element.vehicletype = this.element.vehicletype || '';
  }
}
