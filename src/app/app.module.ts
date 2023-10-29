import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';

import { HttpInterceptorService } from './services/http-interceptor.service';
import { PwaService } from './services/pwa.service';
import { GlobalService } from './shared/services/global.service';
import { UtilService } from './services/util.service';
import { HttpClient, HttpClientModule, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/modules/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpRequestService } from './shared/services/http-request.service';
import { HttpConfigInterceptor } from './shared/interceptor/http-config.interceptor';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './account/login/login.component';
import { RequestResetComponent } from './account/password/request-reset/request-reset.component';
import { ResponseResetComponent } from './account/password/response-reset/response-reset.component';
import { HomeDashboardModule } from './home-dashboard/home-dashboard.module';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { RegisterComponent } from './account/register/register.component';
import { AccountActivationComponent } from './account/account-activation/account-activation.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RequestResetComponent,
    ResponseResetComponent,
    ModalComponent,
    RegisterComponent,
    AccountActivationComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    NgbModule,
    HomeDashboardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }) ,  RecaptchaModule,
    RecaptchaFormsModule,

  ],
  // providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false }},
  //   ConfigService, HttpRequestService, UserManagerService, AppStorageService  , DecimalPipe , PagingData
  //   , CheckVersionUpdate
  // ],
  providers: [UtilService, GlobalService, PwaService, HttpInterceptorService, AuthGuard, HttpRequestService,

    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
