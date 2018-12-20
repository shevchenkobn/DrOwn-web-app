import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { from } from 'rxjs';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('snav') snav!: MatSidenav;
  public mobileQuery: MediaQueryList;
  public translate: TranslateService;

  private _mobileQueryListener: (e: { matches: boolean }) => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    translate: TranslateService,
    // locale: LocaleService,
    // translation: TranslationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = (e) => {
      changeDetectorRef.detectChanges();
      if (e.matches) {
        this.snav.close();
      } else {
        this.snav.open();
      }
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.translate = translate;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
