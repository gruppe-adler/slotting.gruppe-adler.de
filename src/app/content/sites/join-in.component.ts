import { Component, OnInit } from '@angular/core';
import { Page } from '../data/page';
import { ContentService } from '../content.service';

@Component({
  templateUrl: './join-in.component.html',
  styleUrls: ['./join-in.component.scss']
})
export class JoinInComponent implements OnInit {
  public page: Page;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getPage(623).subscribe(result => this.page = result);
  }
}
