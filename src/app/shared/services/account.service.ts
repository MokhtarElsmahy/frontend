import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { UserVM } from '../models/VM/UserVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { MyRequestModel } from '../models/VM/MyRequestModel';
import { UserRoleVM } from '../models/VM/Request/UserRoleVM';
import { UserRegisterationVM } from '../models/VM/UserRegisterationVM';
import { ForgetPasswordMailVM } from '../models/VM/ForgetPasswordMailVM';
import { ForgetPasswordVM } from '../models/VM/ForgetPasswordVM';
import { AccountActivationVM } from '../models/VM/AccountActivationVM';

@Injectable({
    providedIn: 'root'
})

export class AccountService {
    userToken: string;
    constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
        this.userToken = globals.getCurrentUserToken();
    }

    //Method to handle calling the Post API responsible for creating a new user
    registerOrUpdateUser(user: UserRegisterationVM) {
        this.globals.Spinner = true;
        return this.httpReq.postAuthRequest('accounts/AddUpdateUser', user).toPromise().then()
            .catch(
                error => {
                    this.globals.messages = new Array();
                    let message = new Message();
                    message.type = MessageEnum.Error;
                    this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
                    this.globals.messages.push(message);
                }
            ).finally(
                () => {
                    this.globals.Spinner = false;
                }
            )
    }

    registerUser(user: UserRegisterationVM,reCaptcha :string) {
        this.globals.Spinner = true;
        return this.httpReq.postAuthRequestRecaptcha('accounts/Register', user,reCaptcha).toPromise().then()
            .catch(
                error => {
                    this.globals.messages = new Array();
                    let message = new Message();
                    message.type = MessageEnum.Error;
                    this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
                    this.globals.messages.push(message);
                }
            ).finally(
                () => {
                    this.globals.Spinner = false;
                }
            )
    }




    //Method to handle calling the Post API responsible for activating a new user account
    activateAccount(accountActivationVM: AccountActivationVM) {
        this.globals.Spinner = true;
        return this.httpReq.postAuthRequest('accounts/ActivateAccount', accountActivationVM).toPromise().then()
            .catch(
                error => {
                    this.globals.messages = new Array();
                    let message = new Message();
                    message.type = MessageEnum.Error;
                    this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
                    this.globals.messages.push(message);
                }
            ).finally(
                () => {
                    this.globals.Spinner = false;
                }
            )
    }

    //This API has been removed due to a request from the project client side
    //Method to handle calling the Get API responsible for checking a user email existence
    // checkEmailExistence(email: string) {
    //     this.globals.Spinner = true;
    //     return this.httpReq.GetAuthRequest('accounts/CheckEmailExistence/' + email).toPromise().then(
    //         result => {
    //             let isExisted = (result as GenericVm<boolean>).data;
    //             this.globals.messages = (result as GenericVm<boolean>).messages;

    //             return isExisted;
    //         }
    //     ).catch(
    //         error => {
    //             this.globals.messages = new Array();
    //             let message = new Message();
    //             message.type = MessageEnum.Error;
    //             this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
    //             this.globals.messages.push(message);

    //         }
    //     ).finally(
    //         () => {
    //             this.globals.Spinner = false;
    //         }
    //     )
    // }

    //Method to handle calling the Post API responsible for sending an email to reset password
    sendForgetPasswordMail(forgetPasswordMailModel: ForgetPasswordMailVM,reCaptcha:string) {
        this.globals.Spinner = true;
        return this.httpReq.postAuthRequestRecaptcha('accounts/SendForgetPasswordMail', forgetPasswordMailModel,reCaptcha).toPromise().then()
            .catch(
                error => {
                    this.globals.messages = new Array();
                    let message = new Message();
                    message.type = MessageEnum.Error;
                    this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
                    this.globals.messages.push(message);
                }
            ).finally(
                () => {
                    this.globals.Spinner = false;
                }
            )
    }

    //Method to handle calling the Post API responsible for resetting a user password
    resetPassword(resetPasswordModel: ForgetPasswordVM) {
        this.globals.Spinner = true;
        return this.httpReq.postAuthRequest('accounts/ResetPassword', resetPasswordModel).toPromise().then()
            .catch(
                error => {
                    this.globals.messages = new Array();
                    let message = new Message();
                    message.type = MessageEnum.Error;
                    this.translate.get('errors.server-not-available').subscribe((text: string) => message.body = text);
                    this.globals.messages.push(message);
                }
            ).finally(
                () => {
                    this.globals.Spinner = false;
                }
            )
    }
}