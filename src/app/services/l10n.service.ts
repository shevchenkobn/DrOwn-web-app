import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const LOCALE_KEY = 'locale';
const locales = ['en-US', 'uk-UA'];
const defaultLocale = locales[0];

@Injectable()
export class LocalizationService {
  public translate: TranslateService;
  private _location: Location;

  constructor(translate: TranslateService) {
    // this._location = location;
    this.translate = translate;

    this.translate.setDefaultLang(defaultLocale);
  }

  selectLocale(lang: string) {
    if (!locales.includes(lang)) {
      throw new TypeError(`Unknown locale: ${lang}`);
    }
    this.translate.setDefaultLang(lang);
    localStorage.setItem(LOCALE_KEY, lang);
  }
}
