import { Component, Input, OnInit } from '@angular/core';
import { EditService } from '../edit.service';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss', '../../node.component.scss'],
  selector: 'app-edit-node'
})
export class NodeComponent implements OnInit {
  @Input() context: any;
  @Input() reservation = '';

  constructor(private editService: EditService) {
  }

  ngOnInit(): void {
  }

  onDrop(event, context, targetType): void {
    const origin = event.dragData.origin;
    let data = event.dragData.data;
    const type = event.dragData.type;
    const index = origin.indexOf(data);

    if (context.preset) {
      return;
    }

    switch (targetType) {
      case 'squad': {
        if (type !== 'fireteam') {
          return;
        }
      } break;

      case 'platoon': {
        if (type !== 'squad' && type !== 'platoon') {
          return;
        }
      } break;

      case 'company': {
        if (type === 'fireteam') {
          return;
        } break;
      }
    }

    this.editService.removeHighlightedContainer(event.nativeEvent.target);

    console.log(event);
    if (data === context) {
      return;
    }
    if (index > -1 && !data.preset) {
      origin.splice(index, 1);
    }
    if (data.preset) {
      data = JSON.parse(JSON.stringify(data));
      delete data.preset;
    }
    context[type] = context[type] || [];
    context[type].push(data);
    this.editService.matchDirty = true;
    console.log(context);
  }

  public onDragEnter(event): void {
    this.editService.updateHighlightedContainer(event.target);
    console.log('enter', event);
  }
  public onDragLeave(event): void {
    this.editService.removeHighlightedContainer(event.target);
    console.log('leave', event);
  }
}
