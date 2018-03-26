import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['../../node.component.scss', './node.component.scss'],
  selector: 'app-edit-node'
})
export class NodeComponent implements OnInit {
  @Input() context: any;
  @Input() reservation = '';

  public companyOptions = {
    moves: (el, container, handle) => {
      console.log(el, container, handle);
      return handle !== container;
    },
    accepts: (el, target, source, sibling) => {
      console.log('dwad');
      return true;
    }
  };

  constructor(private dragulaService: DragulaService) {
  }

  ngOnInit(): void {
  }
}
