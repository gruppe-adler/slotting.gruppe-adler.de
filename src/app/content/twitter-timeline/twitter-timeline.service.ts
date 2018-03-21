import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TwitterTimelineService {
  readonly twitterScriptId = 'twitter-wjs';
  readonly twitterWidjetUrl = 'https://platform.twitter.com/widgets.js';

  public loadScript(): Observable<any> {
    return Observable.create(observer => {
      // Load script into dom
      this.startScriptLoad();

      // Go on when script is loaded
      window['twttr'].ready
      (
        function onLoadTwitterScript(twttr)
        {
          observer.next(twttr);
          observer.complete();
        }
      );
    });
  }

  private startScriptLoad(): any {
    window['twttr'] = (function(d, s, id, url)
    {
      let js, fjs = d.getElementsByTagName(s)[0], t = window['twttr'] || {};

      if (d.getElementById(id)) {
        return t;
      }

      js = d.createElement(s);
      js.id = id;
      js.src = url;
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];

      t.ready = function(f)
      {
        t._e.push(f);
      };

      return t;
    }(document, 'script', this.twitterScriptId, this.twitterWidjetUrl));
  }
}
