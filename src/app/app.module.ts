import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule, MatSelectionList,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtModule } from '@auth0/angular-jwt';
import { httpInterceptorProviders } from './_interceptors';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { AppOverlayModule } from './_modules/overlay/overlay.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';
import { ShowPasswordDialogComponent } from './show-password-dialog/show-password-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UserComponent } from './user/user.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailCoreComponent } from './user-detail-core/user-detail-core.component';
import { UserCreateCoreComponent } from './user-create-core/user-create-core.component';
import { RegisterComponent } from './register/register.component';
import { UserUpdateCoreComponent } from './user-update-core/user-update-core.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { DronesComponent } from './drones/drones.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/l10n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    PageNotFoundComponent,
    UsersComponent,
    LoginComponent,
    ProgressSpinnerComponent,
    ProfileComponent,
    PasswordChangeDialogComponent,
    ShowPasswordDialogComponent,
    ConfirmDialogComponent,
    UserComponent,
    InfoDialogComponent,
    UserCreateComponent,
    UserDetailCoreComponent,
    UserCreateCoreComponent,
    RegisterComponent,
    UserUpdateCoreComponent,
    UserDetailComponent,
    UserUpdateComponent,
    DronesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    AppOverlayModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: AuthService.getAccessToken,
    //     whitelistedDomains: [environment.host],
    //     blacklistedRoutes: AuthService.NO_AUTH_PATHS,
    //     throwNoTokenError: true,
    //     skipWhenExpired: true
    //   }
    // }),
    AppRoutingModule,

    BrowserAnimationsModule,

    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    // MatSelectionList,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ShowPasswordDialogComponent,
    PasswordChangeDialogComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
  ]
})
export class AppModule { }
