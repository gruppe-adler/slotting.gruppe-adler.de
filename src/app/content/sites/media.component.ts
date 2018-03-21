import { Component, OnInit } from '@angular/core';
import { Page } from '../data/page';
import { ContentService } from '../content.service';

@Component({
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  public page: Page;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getPage(27).subscribe(result => this.page = result);
  }
}
