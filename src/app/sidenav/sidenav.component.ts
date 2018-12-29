import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { L10nService } from '../_services/l10n.service';
import { MatSelectionList } from '@angular/material';
import { routes } from '../app-routing.module';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../_auth/auth.service';
import { Subscription } from 'rxjs';
import { IUser } from '../_model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  public l10n: L10nService;
  protected _auth: AuthService;
  protected _router: Router;

  public activeLocale: string;
  public locales = Object.entries({
    'uk-UA': 'Українська',
    'en-US': 'English (US)',
  });
  private onLoginChange$!: Subscription;
  public isLoggedIn: boolean;

  constructor(l10nService: L10nService, authService: AuthService, router: Router) {
    this.l10n = l10nService;
    this._auth = authService;
    this._router = router;

    this.activeLocale = l10nService.translate.getDefaultLang();
    this.isLoggedIn = this._auth.isLoggedIn();
  }

  public selectLocale(locale: string) {
    this.l10n.selectLocale(locale);
    this.activeLocale = locale;
  }

  public logout() {
    this._auth.logout();
    this._router.navigateByUrl('/login').catch(err => {
      console.error('From sidenav logout redirect ', err);
    });
  }

  public ngOnInit() {
    this.onLoginChange$ = this._auth.onLoginChange.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  public ngOnDestroy() {
    this.onLoginChange$.unsubscribe();
  }

}
