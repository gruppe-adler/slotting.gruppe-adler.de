import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  public async addShare(tid: string, matchid: string, reservation: string): Promise<any> {
    try {
      return await this.http.post(environment.api.forumUrl + '/arma3-slotting/' + tid + '/match/' + matchid + '/share', {reservation}, {withCredentials: true}).toPromise();
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  public async deleteShare(tid: string, matchid: string, reservation: string): Promise<any> {
    try {
      return await this.http.request('DELETE', environment.api.forumUrl + '/arma3-slotting/' + tid + '/match/' + matchid + '/share', {body: {reservation}, withCredentials: true}).toPromise();
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}
