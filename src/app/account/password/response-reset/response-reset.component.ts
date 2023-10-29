//import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { ForgetPasswordVM } from 'src/app/shared/models/VM/ForgetPasswordVM';
import { AccountService } from 'src/app/shared/services/account.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ResetPasswordService } from '../../services/reset-password.service';
import * as CryptoJS from 'crypto-js';  

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.scss']
})
export class ResponseResetComponent implements OnInit {

  emailKey: string;
  public form = {
    email: null,
    password: null,
    password_confirmation: null,
    reset_token: null
  };
  public error = {
    email: null,
    password: null,
    password_confirmation: null
  };
  isPasswordMatched: boolean = true;

  constructor(public global: GlobalService,
    private resetPasswordService: ResetPasswordService,
    private accountService: AccountService,
    private route:ActivatedRoute ,
    private router : Router, 
    private spinner: NgxSpinnerService) {
      route.queryParams.subscribe(params=>{
        this.form.reset_token = params['code'] ;
          this.emailKey = params['userKey'];
      });
  }

  ngOnInit(): void {
    //this.decryptEmailKey();
  }

  // decryptEmailKey() {
  //   this.emailKey = this.emailKey.replace(' ', '+');
  //   this.emailKey = this.emailKey.substring(4);
  //   const encryptedString = this.emailKey;
  //   this.form.email = CryptoJS.AES.decrypt(JSON.stringify({encryptedString}), "Secret Passphrase").toString(CryptoJS.enc.Utf8);
  // }

  handleResponse(data: any) {
    //console.log(data);
    let _router = this.router;
    _router.navigateByUrl('admin/login');

  }

  handleError(error: any) {
    this.error = error.error.errors;
    // console.log(error);

  }

  onSubmit(f: NgForm) {
    if(f.valid && this.form.password == this.form.password_confirmation){
      this.isPasswordMatched = true;
      let resetPasswordModel = new ForgetPasswordVM();
      resetPasswordModel.email = this.emailKey;
      resetPasswordModel.newPassword = this.form.password;
      resetPasswordModel.code = this.form.reset_token;
      this.spinner.show();
      this.global.Messages = [];
      this.accountService.resetPassword(resetPasswordModel).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.router.navigateByUrl("/login");
        }
      });
    }
    else{
      f.form.markAllAsTouched();
      if(this.form.password != this.form.password_confirmation){
        this.isPasswordMatched = false;
      }
    }
  }
}
