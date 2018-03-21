import { Component, OnInit } from '@angular/core';
import { Page } from '../data/page';
import { ContentService } from '../content.service';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent implements OnInit {
  public page: Page;
  public readonly environment = environment;

  constructor(private contentService: ContentService) {
  }

  ngOnInit(): void {
    this.contentService.getPage(641).subscribe(result => this.page = result);
  }
}
