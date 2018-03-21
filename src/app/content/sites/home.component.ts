import { Component } from '@angular/core';
import { ContentService } from '../content.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public loadingMorePosts = false;
  public readonly pageSize = 5;
  public page = 0;

  constructor(public contentService: ContentService) {}

  public onPageChange(event): void {
    if (event.pageIndex > this.contentService.currentPage - 1) {
      this.loadingMorePosts = true;
      this.contentService.getPosts().then(() => {
        this.page = event.pageIndex;
        window.scrollTo(0, 0);
        this.loadingMorePosts = false;
      });
    } else {
      this.page = event.pageIndex;
      window.scrollTo(0, 0);
    }
  }
}
