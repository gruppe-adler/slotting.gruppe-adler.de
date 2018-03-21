import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private prefix: string = './assets/i18n/', private suffix: string = '.json') {}

  /**
   * Gets the translations from the server
   * @param lang
   * @returns {any}
   */
  getTranslation(lang: string): any {
    console.log('Loading internationalization file', this.prefix + lang + '/translations' + this.suffix);
    return this.http.get(this.prefix + lang + '/translations' + this.suffix);
  }
}
