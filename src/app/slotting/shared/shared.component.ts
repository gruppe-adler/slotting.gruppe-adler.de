import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from './shared.service';

@Component({
  templateUrl: './shared.component.html',
  styleUrls: [ './shared.component.scss' ]
})
export class SharedComponent implements OnInit {
  public topic: any;
  public publicUserUrl: string;

  constructor(private activatedRoute: ActivatedRoute, public sharedService: SharedService) {}

  ngOnInit(): void {
    this.topic = this.activatedRoute.snapshot.data.data.topic;
    this.publicUserUrl = `${window.location.origin}${window.location.pathname}?tid=${this.activatedRoute.snapshot.queryParams.tid}&matchid=${this.activatedRoute.snapshot.queryParams.matchid}&uuid=${this.sharedService.shareData.publicUuid}&reservation=${this.activatedRoute.snapshot.queryParams.reservation}`;
    console.log(this.publicUserUrl);
    console.log(this.topic);
  }
}
