import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('snav') snav!: MatSidenav;
  public mobileQuery: MediaQueryList;
  public translate: TranslateService;

  public isNavigating!: boolean;
  protected _router: Router;
  private _routerEvents$!: Subscription;

  private _mobileQueryListener: (e: { matches: boolean }) => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    translate: TranslateService,
    router: Router,
    // locale: LocaleService,
    // translation: TranslationService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = (e) => {
      changeDetectorRef.detectChanges();
      if (e.matches) {
        this.snav.close().catch(err => {
          console.error('From app root sidenav close', err);
        });
      } else {
        this.snav.open().catch(err => {
          console.error('From app root sidenav open', err);
        });
      }
    };

    this.translate = translate;
    this._router = router;
  }

  ngOnInit() {
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    if (!this.mobileQuery.matches) {
      this.snav.open();
    }
    this.isNavigating = false;
    this._routerEvents$ = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      } else if (event instanceof  NavigationError) {
        this.isNavigating = false;
        console.error('Navigation error', event);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.isNavigating = false;
      }
    });
  }

  ngOnDestroy() {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this._routerEvents$.unsubscribe();
  }
}
