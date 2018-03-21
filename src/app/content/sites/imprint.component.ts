import { Component, OnInit } from '@angular/core';
import { ContentService } from '../content.service';
import { Page } from '../data/page';

@Component({
  template: '<div class="content-container"><div *ngIf="page?.content?.rendered" [innerHtml]="page.content.rendered | safeHtml"></div></div>'
})
export class ImprintComponent implements OnInit {
  public page: Page;
  constructor(public contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getPage(205).subscribe(result => this.page = result);
  }
}
