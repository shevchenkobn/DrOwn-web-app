import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { LocaleService, TranslationService, Language } from 'angular-l10n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @Language() lang: string;
  public mobileQuery: MediaQueryList;
  public locale: LocaleService;
  public translation: TranslationService;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    locale: LocaleService,
    translation: TranslationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.locale = locale;
    this.translation = translation;
  }

  selectLocale(lang: string, locale: string) {
    this.lang = lang;
    this.locale.setCurrentLanguage(lang);
    // this.locale.setDefaultLocale(locale);
  }

  ngOnInit() {
    // this.translation.translationChanged().sub
  }

  ngOnDestroy() {

  }
}
