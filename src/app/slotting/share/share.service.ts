import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enterView } from '@angular/core/src/render3/instructions';
import { environment } from '../../../environments/environment';

@Injectable()
export class ShareService {
  constructor(private http: HttpClient) {}
  public async getShares(tid: string, matchid: string): Promise<any> {
    try {
      return await this.http.get(environment.api.forumUrl + '/arma3-slotting/' + tid + '/match/' + matchid + '/share').toPromise();
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
