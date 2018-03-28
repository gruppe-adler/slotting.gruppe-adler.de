import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  selector: 'app-event-node'
})
export class NodeComponent implements OnInit {
  @Input() context: any;
  @Input() matchid = '';
  @Input() reservation = '';

  ngOnInit(): void {
    if (this.context['reserved-for'] && this.context['reserved-for'] !== '') {
      this.reservation = this.context['reserved-for'];
    }
  }
}
