import { Component, OnInit, ViewChild } from '@angular/core';
import { L10nService } from '../_services/l10n.service';
import { MatSelectionList } from '@angular/material';
import { routes } from '../app-routing.module';
import { LocalizeRouterService } from 'localize-router';

const localeNames = {
  'uk-UA': 'Українська',
  'en-US': 'English (American)',
};

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  public l10n: L10nService;
  public activeLocale: string;
  public locales = Object.entries({
    'uk-UA': 'Українська',
    'en-US': 'English (US)',
  });
  public routes = routes;

  constructor(l10nService: L10nService) {
    this.l10n = l10nService;
    this.activeLocale = l10nService.translate.getDefaultLang();
  }

  selectLocale(locale: string) {
    this.l10n.selectLocale(locale);
    this.activeLocale = locale;
  }

  ngOnInit() {
  }

}
