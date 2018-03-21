import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ArmaServerBadgeService {
  constructor(private httpClient: HttpClient) {}

  public async getData(apiKey: string): Promise<any> {
    try {
      return await this.httpClient.get(`https://arma3-servers.net/api/?object=servers&element=detail&key=${apiKey}`).toPromise();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
