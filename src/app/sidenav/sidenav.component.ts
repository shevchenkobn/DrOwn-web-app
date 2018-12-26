import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { L10nService } from '../_services/l10n.service';
import { MatSelectionList } from '@angular/material';
import { routes } from '../app-routing.module';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../_auth/auth.service';
import { Subscription } from 'rxjs';
import { IUser } from '../_model/user.model';
import { Router } from '@angular/router';

const localeNames = {
  'uk-UA': 'Українська',
  'en-US': 'English (American)',
};

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
  public routes = routes;
  private onLoginChange$!: Subscription;
  private onUserRefresh$!: Subscription;

  public user?: Readonly<IUser>;

  public isLoggedIn: boolean;

  private _userSetter = (user: Readonly<IUser> | undefined) => {
    this.user = user;
  }

  constructor(l10nService: L10nService, authService: AuthService, router: Router) {
    this.l10n = l10nService;
    this._auth = authService;
    this._router = router;

    this.activeLocale = l10nService.translate.getDefaultLang();
    this.isLoggedIn = this._auth.isLoggedIn();
    this.updateUser();
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
      this.updateUser();
    });
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(this._userSetter);
  }

  public ngOnDestroy() {
    this.onLoginChange$.unsubscribe();
    this.onUserRefresh$.unsubscribe();
  }

  private updateUser() {
    if (!this.isLoggedIn) {
      return;
    }
    if (this._auth.hasUser()) {
      this.user = this._auth.getUser();
    } else {
      this._auth.refreshUser().subscribe(this._userSetter, err => {
        console.error('From sidenav updateUser ', err);
      });
    }
  }

}
