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
import { UserRoles } from './_models/user.model';
import { UserDetailCoreComponent } from './user-detail-core/user-detail-core.component';
import { UserResolver } from './_resolvers/user.resolver';
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { DronesComponent } from './drones/drones.component';
import { DronesResolver } from './_resolvers/drones.resolver';
import { DroneCreateComponent } from './drone-create/drone-create.component';
import { DroneDetailsComponent } from './drone-details/drone-details.component';
import { DroneUpdateComponent } from './drone-update/drone-update.component';
import { DroneResolver } from './_resolvers/drone.resolver';

export const dashboardPaths = {
  users: 'users',
  homeDrones: 'home/drones', // NOTE: if changed, routes below also must be changed
};

export const routes: Routes = [
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent, pathMatch: 'full' },
  { path: 'register', canActivate: [LoginGuard], component: RegisterComponent, pathMatch: 'full' },
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
        resolve: {
          user: UserResolver,
        },
        children: [
          {
            path: '',
            component: UserDetailComponent,
          },
          {
            path: 'edit',
            component: UserUpdateComponent,
          }
        ]
      },
    ],
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        resolve: {
          profile: ProfileResolver,
        },
      },
      {
        path: 'drones',
        canActivate: [AuthGuard],
        data: {
          authRoles: UserRoles.OWNER
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: DronesComponent,
            resolve: {
              drones: DronesResolver
            }
          },
          {
            path: 'create',
            component: DroneCreateComponent,
            resolve: {
              owner: ProfileResolver
            }
          },
          {
            path: ':id',
            resolve: {
              drone: DroneResolver
            },
            children: [
              {
                path: '',
                component: DroneDetailsComponent
              },
              {
                path: 'edit',
                component: DroneUpdateComponent,
                resolve: {
                  owner: ProfileResolver
                }
              },
            ]
          }
        ]
      },
      {
        path: '', pathMatch: 'full', redirectTo: 'profile'
      }
    ],
  },
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
