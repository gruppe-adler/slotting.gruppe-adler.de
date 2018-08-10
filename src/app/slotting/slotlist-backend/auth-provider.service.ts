import {Injectable} from '@angular/core';

export const authKey = 'slotlist_auth';

@Injectable()
export class AuthProviderService {
  public getAuthorizationHeader(): string {
    return `JWT ${localStorage.getItem(authKey)}`;
  }
}
