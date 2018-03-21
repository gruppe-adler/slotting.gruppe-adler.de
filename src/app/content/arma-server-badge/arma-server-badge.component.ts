import { Component, Input, OnInit } from '@angular/core';
import { ArmaServerBadgeService } from './arma-server-badge.service';

@Component({
  templateUrl: './arma-server-badge.component.html',
  styleUrls: ['./arma-server-badge.component.scss'],
  selector: 'app-arma-server-badge'
})
export class ArmaServerBadgeComponent implements OnInit {
  @Input() apiKey: string;
  public data: any;

  constructor(private armaServerBadgeService: ArmaServerBadgeService) {}

  ngOnInit(): void {
    this.armaServerBadgeService.getData(this.apiKey).then(data => {
       this.data = data;
      console.log(this.data);
    });
  }
}
