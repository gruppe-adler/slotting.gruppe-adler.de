import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { SlottingService } from './slotting.service';

@Component({
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  selector: 'app-event-node'
})
export class NodeComponent implements OnInit {
  @Input() context: any;
  @Input() matchid = '';
  @Input() reservation = '';
  @Input() minSlottedPlayerCount = 0;

  public readonly environment = environment;

  constructor(public slottingService: SlottingService) {}

  ngOnInit(): void {
    if (this.context['reserved-for'] && this.context['reserved-for'] !== '') {
      this.reservation = this.context['reserved-for'];
    }

    if (this.context['min-slotted-player-count'] > 0) {
      this.minSlottedPlayerCount = this.context['min-slotted-player-count'];
    }
  }
}
