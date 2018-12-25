import { NgModule } from '@angular/core';

import { Location } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeParser, LocalizeRouterModule, LocalizeRouterSettings } from 'localize-router';
import { LocalizeRouterHttpLoader } from 'localize-router-http-loader';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { environment } from '../environments/environment';
import { HomeGuard } from './_guards/home.guard';
import { AuthGuard } from './_auth/auth.guard';
import { LoginGuard } from './_guards/login.guard';
import { UsersComponent } from './users/users.component';

export const dashboardPaths = {
  users: '/users',
  homeDrones: '/home/drones', // NOTE: if changed, routes below also must be changed
  drones: '/drones',
};

export const routes: Routes = [
  { path: '/login', canActivate: [LoginGuard], pathMatch: 'full' },
  { path: dashboardPaths.users, canActivate: [AuthGuard], component: UsersComponent },
  {
    path: '/home',
    canActivate: [AuthGuard],
    children: [
      { path: 'drones' }
    ]
  },
  { path: dashboardPaths.drones, canActivate: [AuthGuard] },
  { path: '/home', canActivate: [AuthGuard, HomeGuard], pathMatch: 'full' },
  { path: '/', canActivate: [AuthGuard, HomeGuard], pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (
          translate: TranslateService,
          location: Location,
          settings: LocalizeRouterSettings,
          http: HttpClient,
        ) =>
          new LocalizeRouterHttpLoader(translate, location, settings, http),
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient],
      },
    }),
    RouterModule.forRoot(routes, {
      enableTracing: !environment.production,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
