import { Component, Input, OnInit } from '@angular/core';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss', '../../node.component.scss'],
  selector: 'app-edit-node'
})
export class NodeComponent implements OnInit {
  @Input() context: any;
  @Input() reservation = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  onDrop(event, context): void {
    const origin = event.dragData.origin;
    let data = event.dragData.data;
    const type = event.dragData.type;
    const index = origin.indexOf(data);
    console.log(data);
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
    console.log(context);
  }
}
