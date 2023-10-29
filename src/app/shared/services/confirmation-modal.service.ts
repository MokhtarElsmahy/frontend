import { Injectable, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service'; 
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ConfirmationModalService {
  userToken: string;
  modalType: string;
  model: any;
  caller: any;
  message: string;
  response: boolean;
  isConfirmed:boolean=false;
  confirmAction: (model: any) => Promise<void | object>;

  confirmFun :()=>void
  constructor(private http: HttpClient,
     public globals: GlobalService,
     public httpReq: HttpRequestService,
     public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  setConfirmed(confirmed: boolean) {
    if(confirmed) {
      this.confirmAction(this.model);
      let elementIndex = this.caller.listToView.findIndex(r => r == this.model);
      this.caller.listToView.splice(elementIndex, 1);
      document.location.reload();
    }
  }

  Execute(confirmed: boolean){
    if(confirmed) {
    
      this.isConfirmed = confirmed;
      this.confirmFun()
      // this.model.isChecked = false;
      //  let elementIndex = this.caller.listToView.findIndex(r => r == this.model);
      //  this.caller.listToView.splice(elementIndex, 1);
    }
  }

  getisConfirmed(){
    return this.isConfirmed;
  }

  ResetisConfirmed(){
    return this.isConfirmed=false;
  }
}
