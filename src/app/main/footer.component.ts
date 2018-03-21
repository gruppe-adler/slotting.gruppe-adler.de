import { Component } from '@angular/core';
import { ContentService } from '../content/content.service';

@Component({
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  selector: 'app-footer'
})
export class FooterComponent {
  public year = new Date().getFullYear();

  constructor(public contentService: ContentService) {}
}
