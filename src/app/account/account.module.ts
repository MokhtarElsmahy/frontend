import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/modules/shared.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { HomeComponent } from '../home-dashboard/home/home.component';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
  
    HomeComponent,
    AccountActivationComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    NgbModule, 
      RecaptchaModule,
    RecaptchaFormsModule,

  ],
  providers: [
    NgbActiveModal,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    }
  ]
})
export class AccountModule { }
