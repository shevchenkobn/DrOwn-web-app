import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const LOCALE_KEY = 'locale';
const locales = ['en-US', 'uk-UA'];
const defaultLocale = locales[0];

@Injectable({
  providedIn: 'root',
})
export class L10nService {
  public translate: TranslateService;
  // private _location: Location;

  constructor(translate: TranslateService) {
    // this._location = location;
    this.translate = translate;

    this.init();
  }

  selectLocale(lang: string) {
    if (!locales.includes(lang)) {
      throw new TypeError(`Unknown locale: ${lang}`);
    }
    this.translate.setDefaultLang(lang);
    localStorage.setItem(LOCALE_KEY, lang);
  }

  private init() {
    this.translate.addLangs(locales);

    let locale = localStorage.getItem(LOCALE_KEY);
    if (!locale) {
      const localePieces = this.translate.getBrowserCultureLang().split(/[_-]/g);
      localePieces[1] = localePieces[1].toUpperCase();
      const browserLocale = localePieces.join('-');
      if (locales.includes(browserLocale)) {
        locale = browserLocale;
      }
    }
    if (!locale) {
      locale = defaultLocale;
    }
    this.translate.setDefaultLang(locale);
    localStorage.setItem(LOCALE_KEY, locale);
  }
}
