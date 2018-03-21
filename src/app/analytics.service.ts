import { Injectable } from '@angular/core';
import { StorageService } from './storage/storage.service';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';

declare const ga: Function;

@Injectable()
export class AnalyticsService {
  constructor(private storageService: StorageService, private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sendPageView(event.urlAfterRedirects);
      }
    });
  }

  public init(): void {
    if (!this.isGoogleAnalyticsEnabled()) {
      window[`ga-disable-${environment.analytics.analyticsId}`] = true;
      return;
    }
    ga('create', environment.analytics.analyticsId, {
        'storage': 'none',
        'clientId': this.getClientId(),
        storeGac: false
      });
    ga('set', 'anonymizeIp', true);
  }

  public isGoogleAnalyticsEnabled(): boolean {
    return !localStorage.getItem(environment.analytics.analyticsOptOutKey);
  }

  public disableGoogleAnalytics(): void {
    localStorage.setItem(environment.analytics.analyticsOptOutKey, 'true');
    window[`ga-disable-${environment.analytics.analyticsId}`] = true;
  }

  public enableGoogleAnalytics(): void {
    localStorage.removeItem(environment.analytics.analyticsOptOutKey);
    window[`ga-disable-${environment.analytics.analyticsId}`] = false;
  }

  public sendPageView(page: string): void {
    if (!this.isGoogleAnalyticsEnabled()) {
      return;
    }

    ga('set', 'page', page);
    ga('send', 'pageview');
  }

  public sendEvent(category: string, action: string, label = '', value = ''): void {
    if (!this.isGoogleAnalyticsEnabled()) {
      return;
    }

    ga('send', 'event', category, action, label, value);
  }

  private getClientId(): string {
    let key = this.storageService.get(environment.analytics.analyticsStorageKey);
    if (key) {
      return key;
    }

    key = this.generateGuid();
    this.storageService.set(environment.analytics.analyticsStorageKey, key);
    return key;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
