import { Injectable , OnInit,Component } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { EmpSelectiveBroadcastItem, MainClassificationVM, SelectiveBroadcastItemVm, SelectiveBroadcastVm, SubClassificationVM } from '../../models/VM/businessServices/SelectiveBroadcastVm';

@Injectable({
  providedIn: 'root'
})
export class SubscribeRequestService {

  userToken: string;
  SelectiveBroadcastVm :SelectiveBroadcastVm = new SelectiveBroadcastVm();
  itemsLst : Array<SelectiveBroadcastItemVm>
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }


  getAllRequests(userId:string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('SelectiveBroadcast/GetAllSelectiveBroadcastRequests/'+userId).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<EmpSelectiveBroadcastItem>>).data;
        this.globals.messages = (result as GenericVm<Array<EmpSelectiveBroadcastItem>>).messages;
        
        return List;
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


  getRequestById(Id: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('SelectiveBroadcast/GetSelectiveBroadcastRequestById/'+Id+'/'+userId).toPromise().then(
      result => {
        let Request = (result as GenericVm<SelectiveBroadcastVm>).data;
        this.globals.messages = (result as GenericVm<SelectiveBroadcastVm>).messages;
        
        return Request;
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


  createNewRequest(SelectiveBroadcastVm: SelectiveBroadcastVm){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('SelectiveBroadcast/CreateNewSelectiveBroadcast', SelectiveBroadcastVm).toPromise().then()
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

  updateRequest(SelectiveBroadcastVm: SelectiveBroadcastVm){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('SelectiveBroadcast/UpdateSelectiveBroadcast', SelectiveBroadcastVm).toPromise().then()
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

  GetMainCalssifications(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('SelectiveBroadcast/MainClassification').toPromise().then(
      result => {
        let List = (result as GenericVm<Array<MainClassificationVM>>).data;
        this.globals.messages = (result as GenericVm<Array<MainClassificationVM>>).messages;
        
        return List;
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

  GetSubCalssifications(mainId :number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('SelectiveBroadcast/SubClassification/'+mainId).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<SubClassificationVM>>).data;
        this.globals.messages = (result as GenericVm<Array<SubClassificationVM>>).messages;
        
        return List;
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

  getSubscribtion(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('SelectiveBroadcast/GetSelectiveBroadcastRequest/'+userId).toPromise().then(
      result => {
        let Request = (result as GenericVm<SelectiveBroadcastVm>).data;
        
        this.globals.messages = (result as GenericVm<SelectiveBroadcastVm>).messages;
        this.SelectiveBroadcastVm=Request;
        //return Request;
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
