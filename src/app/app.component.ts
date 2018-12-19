import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public mobileQuery: MediaQueryList;
  public translate: TranslateService;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    translate: TranslateService,
    // locale: LocaleService,
    // translation: TranslationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.translate = translate;
  }

  selectLocale(lang: string) {
    // this.lang = lang;
    // this.locale.setCurrentLanguage(lang);
    this.translate.setDefaultLang(lang);
    localStorage.setItem('locale', lang);
    // this.locale.setDefaultLocale(locale);
  }

  ngOnInit() {
    // const locale = localStorage.getItem('locale');
    // // this.translation.translationChanged().sub
    // this.translate.setDefaultLang('en-US');
    // if (!locale) {
    //   localStorage.setItem('locale', 'en-US');
    // } else {
    //   this.translate.setDefaultLang(locale);
    // }
  }

  ngOnDestroy() {

  }
}
