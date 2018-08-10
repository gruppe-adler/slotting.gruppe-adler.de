import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

function portPart(): string {
  return (window.location.port && `:${window.location.port}`) || '';
}
function getBaseUrl(): string {
  return `${window.location.protocol}//${window.location.hostname}${portPart()}`;
}

@Injectable()
export class OpenidAuthUrlService {
  public getOpenIDAuthUrl(): string {
    return environment.openIdAuthUrl
      .replace('{realm}', getBaseUrl())
      .replace('{return_url}', `${getBaseUrl()}/auth`);
  }
}
