import { Component, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { CommonVM } from '../../models/VM/CommonVM';
import { LibraryExchangeRequestVM , LibraryExchangeBookVM, LibraryExchangeSourceVM} from '../../models/VM/businessServices/LibraryExchangRequestVM';
import { GlobalService } from '../global.service';
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { GiftBackCommentVM } from '../../models/VM/businessServices/GiftBackCommentVM';
import { GiftBackBookVM } from '../../models/VM/businessServices/GiftBackBookVM';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class LibraryExchangeRequestService {
  LibraryExchangeRequestVM :LibraryExchangeRequestVM
  GiftBackBookVMToArchive: LibraryExchangeBookVM = new LibraryExchangeBookVM()
  IsConfirmed : boolean = false;
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }


  SetIsConfirmed(value : boolean){
    this.IsConfirmed = value;
  }

  GetIsConfirmed(){
    return this.IsConfirmed ;
  }

  SetExchangeInfo(GiftBackBookVMToArchive: LibraryExchangeBookVM){
    this.GiftBackBookVMToArchive = GiftBackBookVMToArchive;
  }

  getExchangeInfo(){
    return this.GiftBackBookVMToArchive ;
  }

  getAllLibraryExchangeRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('LibraryExchangeRequest/GetAllLibraryExchangeRequests/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<LibraryExchangeRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<LibraryExchangeRequestVM>>).messages;
        
        return replieslist;
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


  GetArchivedLibraryExchangeRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('LibraryExchangeRequest/GetArchivedLibraryExchangeRequests/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<LibraryExchangeRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<LibraryExchangeRequestVM>>).messages;
        
        return replieslist;
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

  addToArchivedAndUpdateGiftBookRequest(GiftBackRequestVM: LibraryExchangeRequestVM) {
    this.globals.Spinner = true;
   
    GiftBackRequestVM.isArchived = true;
    GiftBackRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/UpdateLibraryExchangeRequest', GiftBackRequestVM).toPromise().then()
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

  UnArchivedAndUpdateGiftBookRequest(GiftBackRequestVM: LibraryExchangeRequestVM) {
    this.globals.Spinner = true;
   
    GiftBackRequestVM.isArchived = false;
    GiftBackRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/UpdateLibraryExchangeRequest', GiftBackRequestVM).toPromise().then()
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

  createNewComment(giftBackComment :GiftBackCommentVM){

    this.globals.Spinner = true;
    giftBackComment.createdBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/CreateNewRequestComment', giftBackComment).toPromise().then()
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

  getAllRequestComment(RequestId: number) {
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('LibraryExchangeRequest/GetAllRequestComment/'+RequestId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<GiftBackCommentVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackCommentVM>>).messages;
        
        return replieslist;
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


  createNewRequest(giftBackRequest :LibraryExchangeRequestVM){

    this.globals.Spinner = true;
    giftBackRequest.isArchived = false;
    giftBackRequest.createdBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/CreateLibraryExchangeRequest', giftBackRequest).toPromise().then()
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

  ValidateNewRequest(giftBackRequest :LibraryExchangeRequestVM){

   
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/ValidateLibraryExchangeRequest', giftBackRequest).toPromise().then(

      result =>{

        let replieslist = (result as GenericVm<Array<GiftBackBookVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackBookVM>>).messages;
        
        return replieslist;
      }

    )
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

  updateRequest(giftBackRequest :LibraryExchangeRequestVM){

    this.globals.Spinner = true;
    giftBackRequest.isArchived = false;
    giftBackRequest.updatedBy = this.globals.getCurrentUserId();
    giftBackRequest.updatedDate = new Date();
    return this.httpReq.postAuthRequest('LibraryExchangeRequest/UpdateLibraryExchangeRequest', giftBackRequest).toPromise().then()
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

  getRequestById(RequestId:number ,userId:string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('LibraryExchangeRequest/GetLibraryExchangeRequestById/'+RequestId+'/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<LibraryExchangeRequestVM>).data;
        this.globals.messages = (result as GenericVm<LibraryExchangeRequestVM>).messages;
        
        return replieslist;
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


  getAllSources() {
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('LibraryExchangeRequest/GetLibExchangeSources/').toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<LibraryExchangeSourceVM>>).data;
        this.globals.messages = (result as GenericVm<Array<LibraryExchangeSourceVM>>).messages;
        
        return replieslist;
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
