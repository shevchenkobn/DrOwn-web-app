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
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolver } from './_auth/profile.resolver';
import { UsersResolver } from './_resolvers/users.resolver';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserRoles } from './_model/user.model';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserResolver } from './_resolvers/user.resolver';

export const dashboardPaths = {
  users: 'users',
  homeDrones: 'home/drones', // NOTE: if changed, routes below also must be changed
};

export const routes: Routes = [
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent, pathMatch: 'full' },
  {
    path: dashboardPaths.users,
    canActivate: [AuthGuard],
    data: {
      authRoles: UserRoles.ADMIN,
    },
    children: [
      {
        path: '',
        component: UsersComponent,
        resolve: {
          users: UsersResolver,
          profile: ProfileResolver,
        },
      },
      {
        path: 'create',
        component: UserCreateComponent,
      },
      {
        path: ':id',
        component: UserDetailComponent,
        resolve: {
          user: UserResolver,
        },
      },
    ],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    children: [
      // { path: 'drones' } !authrolse
      {
        path: 'profile',
        component: ProfileComponent,
        resolve: {
          profile: ProfileResolver,
        },
      },
    ],
  },

  { path: 'home', canActivate: [AuthGuard], pathMatch: 'full', redirectTo: '/home/profile' },
  { path: 'not-found', component: PageNotFoundComponent, pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard, HomeGuard],
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: !environment.production,
    }),
    // LocalizeRouterModule.forRoot(routes, {
    //   parser: {
    //     provide: LocalizeParser,
    //     useFactory: (
    //       translate: TranslateService,
    //       location: Location,
    //       settings: LocalizeRouterSettings,
    //       http: HttpClient,
    //     ) =>
    //       new LocalizeRouterHttpLoader(translate, location, settings, http),
    //     deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient],
    //   },
    // }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
