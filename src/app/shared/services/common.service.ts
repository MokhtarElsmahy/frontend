import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from './global.service'; 
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { CommonVM } from '../models/VM/CommonVM';

@Injectable({
    providedIn: 'root'
  })
export class CommonService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting the list of common values by domain
  GetCommonsByDomain(domain: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('visitRequest/GetCommonsByDomain/'+domain).toPromise().then(
      result => {
        let CommonsList = (result as GenericVm<Array<CommonVM>>).data;
        this.globals.messages = (result as GenericVm<Array<CommonVM>>).messages;
        
        return CommonsList;
      }
    ).catch(
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