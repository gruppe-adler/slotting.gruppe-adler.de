import {Injectable} from '@angular/core';

export const authKey = 'slotlist_auth';

@Injectable()
export class AuthProviderService {
  public getAuthorizationHeader(): string {
    return `JWT ${localStorage.getItem(authKey)}`;
  }

  public updateToken(token: string): void {
    window.console.info(`updating stored token. previous / current: ${localStorage.getItem(authKey)} / ${token}`);
    localStorage.setItem(authKey, token);
  }
}
