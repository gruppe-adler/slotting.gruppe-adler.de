import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

declare const TSV: any;

@Injectable()
export class TeamspeakViewerService {
  constructor(private httpClient: HttpClient) {
    this.createDummyTag();
  }

  private createDummyTag(): void {
    if (document.getElementById('ts3viewer_dummy')) {
      return;
    }

    const element = document.createElement('script');
    element.setAttribute('id', 'ts3viewer_dummy');
    element.setAttribute('type', 'text/javascript');
    element.innerHTML = 'var TSV = {}; TSV["ViewerScript"] = {}; TSV["ViewerScript"]["Data"] = []; ';

    document.getElementsByTagName('head')[0].appendChild(element);
  }

  public getTeamspeakData(id: number): Observable<any> {
    return Observable.create(observer => {
      let element = document.getElementById('ts3viewer_data');
      if (element) {
        observer.next(TSV.ViewerScript.Data[id.toString()]);
        observer.complete();
        return;
      }

      element = document.createElement('script');

      element.onload = () => {
        observer.next(TSV.ViewerScript.Data[id.toString()]);
        observer.complete();
      };

      element.setAttribute('id', 'ts3viewer_data');
      element.setAttribute('type', 'text/javascript');
      element.setAttribute('src', `https://www.tsviewer.com/ts3viewer.php?ID=${id}`);

      document.getElementsByTagName('head')[0].appendChild(element);
    });
  }
}
