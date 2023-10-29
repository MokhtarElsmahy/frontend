import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {EmailExist} from '../validation/EmailExist';
import { NgxSpinnerModule } from "ngx-spinner";
import { BackButtonComponent } from '../components/back-button/back-button.component';




@NgModule({
  declarations: [EmailExist , BackButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports:[ 
    FormsModule,EmailExist,
    NgxSpinnerModule, BackButtonComponent,
    TranslateModule]

})
export class SharedModule { }
