import { Component, OnInit, ViewChild } from '@angular/core';
import { L10nService } from '../services/l10n.service';
import { MatSelectionList } from '@angular/material';

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

  constructor(l10nService: L10nService) {
    this.l10n = l10nService;
    this.activeLocale = l10nService.translate.getDefaultLang();
  }

  selectLocale(locale: string) {
    this.l10n.selectLocale(locale);
    this.activeLocale = locale;
  }

  ngOnInit() {
    console.log(this);
  }

}
