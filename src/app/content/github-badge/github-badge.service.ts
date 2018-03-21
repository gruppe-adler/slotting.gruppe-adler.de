import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GithubBadgeService {
  private readonly headers: HttpHeaders = new HttpHeaders({
    'Accept': 'application/vnd.github.v3+json'
  });

  constructor(private httpClient: HttpClient) {}

  public async getOrganizationData(project: string): Promise<any> {
    try {
      return await this.httpClient.get(`https://api.github.com/orgs/${project}`, { headers: this.headers }).toPromise();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
