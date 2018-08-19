import {OpenidAuthUrlService} from './openid-auth-url.service';
import {Injectable} from '@angular/core';
import {parseSearchString} from '../../util/parse-search-string.fn';
import {V1authService} from '../../generated/slotlist-backend';

const localStorageKey = 'slotlist_auth';

@Injectable()
export class LoginService {


  public constructor(
    private v1AuthService: V1authService,
  ) {
  }

  public getAuthToken(): string {
    return localStorage.getItem(localStorageKey);
  }

  public authInProgress(): boolean {
    return Object.keys(parseSearchString(window.location.search)).some(k => k.indexOf('openid') !== -1);
  }

  public postToSlotlistBackend(): void {
    this.v1AuthService.postV1AuthSteam({
      url: window.location.href
    }).subscribe((result) => {
      localStorage.setItem(localStorageKey, result.token);
      window.console.info('got token: ' + result.token);
    }, (error) => {
      console.warn('foo: ' + error);
      console.warn(error);
    });
  }

  public goToAuth(): void {
    localStorage.removeItem(localStorageKey);
    this.v1AuthService.getV1AuthSteam().subscribe((res) => {
      window.location.href = res.url;
    }, (err) => {
      console.error(err);
    });
  }
}
