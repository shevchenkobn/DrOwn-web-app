import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { L10nService } from '../_services/l10n.service';
import { MatSelectionList } from '@angular/material';
import { routes } from '../app-routing.module';
import { LocalizeRouterService } from 'localize-router';
import { AuthService } from '../_auth/auth.service';
import { Subscription } from 'rxjs';
import { IUser, UserRoles } from '../_model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
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
  private onUserRefresh$!: Subscription;
  public isLoggedIn: boolean;
  public user?: IUser;
  public userRoles = UserRoles;

  private onLoginChange = (isLoggedIn: boolean) => {
    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn && !this.user) {
      this._auth.refreshUser().subscribe(
        user => this.user = user,
        error1 => {
          console.error('From sidenav refresh localUser ', error1);
        },
      );
    }
  }

  constructor(l10nService: L10nService, authService: AuthService, router: Router) {
    this.l10n = l10nService;
    this._auth = authService;
    this._router = router;

    this.activeLocale = l10nService.translate.getDefaultLang();
    this.isLoggedIn = this._auth.isLoggedIn();
  }

  public hasRole(role: UserRoles) {
    return !!this.user && this.user.role & role;
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
    this.onLoginChange$ = this._auth.onLoginChange.subscribe(this.onLoginChange);
    this.onUserRefresh$ = this._auth.onUserRefresh.subscribe(user => {
      this.user = user;
    });
    this.onLoginChange(this._auth.isLoggedIn());
  }

  public ngOnDestroy() {
    this.onLoginChange$.unsubscribe();
    this.onUserRefresh$.unsubscribe();
  }

}
