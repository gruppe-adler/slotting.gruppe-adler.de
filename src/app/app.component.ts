import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public rawView = false;

  constructor(private analyticsService: AnalyticsService, private router: Router, private translateService: TranslateService) {
    analyticsService.init();
    translateService.setDefaultLang('en');

    router.events.subscribe(event => {
      if (event instanceof ActivationStart) {
        console.log(event.snapshot.queryParams.raw, typeof event.snapshot.queryParams.raw);
        this.rawView = event.snapshot.queryParams.raw === '1';
      }
    });

    if (translateService.getBrowserLang() === 'de') {
      console.log('Using German as current language as it matches browser language');
      translateService.use('de');
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
