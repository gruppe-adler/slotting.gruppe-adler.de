import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public rawView = false;

  constructor(private router: Router, private translateService: TranslateService) {
    translateService.setDefaultLang('en');

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
