import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public slotlistBackendEndpoint: string;
  public adlerForumEndpoint: string;

  constructor(private router: Router, private translateService: TranslateService) {
    translateService.setDefaultLang('en');

    if (translateService.getBrowserLang() === 'de') {
      console.log('Using German as current language as it matches browser language');
      translateService.use('de');
    }
  }

  ngOnInit(): void {
    this.slotlistBackendEndpoint = environment.api.slotlistBackendEndpoint;
    this.adlerForumEndpoint = environment.api.forumUrl;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
