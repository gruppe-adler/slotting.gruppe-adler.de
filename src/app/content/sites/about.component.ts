import { Component, OnInit } from '@angular/core';
import { Page } from '../data/page';
import { ContentService } from '../content.service';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public page: Page;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getPage(616).subscribe(result => this.page = result);
  }
}
