
import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { VisitRequestVM } from '../../models/VM/businessServices/VisitRequestVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { VisitAvailableDateVM } from '../../models/VM/basicData/VisitAvailableDateVM';
import { LibraryAvailableDayVM } from '../../models/VM/basicData/LibraryAvailableDayVM';
import { CommonVM } from '../../models/VM/CommonVM';
import { VisitDatesGeneratorVM } from '../../models/VM/VisitDatesGeneratorVM';
import { VisitRequestReplyVM } from '../../models/VM/businessServices/VisitRequestReplyVM';
import { PeriodVM } from '../../models/VM/basicData/PeriodVM';
import { GiftBackRequestVM } from '../../models/VM/businessServices/GiftBackRequestVM';
import { GiftBackBookVM } from '../../models/VM/businessServices/GiftBackBookVM';
import { GiftBackSearchVm } from '../../models/VM/businessServices/GiftBackSearchVm';
import { GiftedBookVM } from '../../models/VM/businessServices/GiftedBookVM';
import { GiftBackCommentVM } from '../../models/VM/businessServices/GiftBackCommentVM';

@Injectable({
  providedIn: 'root'
})
export class GiftBookRequestService {

  userToken: string;
  List : Array<GiftBackBookVM>
  IsConfirmed : boolean = false;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  SetIsConfirmed(value : boolean){
    this.IsConfirmed = value;
  }

  GetIsConfirmed(){
    return this.IsConfirmed ;
  }
  getAllBookGiftRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('GiftBackRequest/GetAllGiftBackRequests/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<GiftBackRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackRequestVM>>).messages;
        
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

  getAllRequestComment(RequestId: number) {
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('GiftBackRequest/GetAllRequestComment/'+RequestId).toPromise().then(
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


  GetArchivedGiftBackRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('GiftBackRequest/GetArchivedGiftBackRequests/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<GiftBackRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackRequestVM>>).messages;
        
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

  addToArchivedAndUpdateGiftBookRequest(GiftBackRequestVM: GiftBackRequestVM) {
    this.globals.Spinner = true;
    GiftBackRequestVM.isArchived = true;
    GiftBackRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('GiftBackRequest/UpdateGiftBackRequest', GiftBackRequestVM).toPromise().then()
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

  UnArchivedAndUpdateGiftBookRequest(GiftBackRequestVM: GiftBackRequestVM) {
    this.globals.Spinner = true;
    GiftBackRequestVM.isArchived = false;
    GiftBackRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('GiftBackRequest/UpdateGiftBackRequest', GiftBackRequestVM).toPromise().then()
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

  setSelectedBookGiftRequest(selectedList :GiftBackBookVM[]){

    this.List =new Array<GiftBackBookVM>
    this.List =selectedList

  }

  GetSelectedBookGiftRequest(){
   return this.List 
  }

  SearchAvailableGiftedBooks(giftBackSearchVm :GiftBackSearchVm){

    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('GiftBackRequest/SearchAvailableGiftedBooks', giftBackSearchVm).toPromise().then(

      result =>{

        let replieslist = (result as GenericVm<Array<GiftBackBookVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackRequestVM>>).messages;
        
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

  GetAllAvailableGiftedBooks(){

    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('GiftBackRequest/GetAllAvailableGiftedBooks').toPromise().then(

      result =>{

        let replieslist = (result as GenericVm<Array<GiftBackBookVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackRequestVM>>).messages;
        
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

  createNewRequest(giftBackRequest :GiftBackRequestVM){

    this.globals.Spinner = true;
    giftBackRequest.isArchived = false;
    giftBackRequest.createdBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('GiftBackRequest/CreateNewGiftBackRequest', giftBackRequest).toPromise().then()
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

  ValidateNewRequest(giftBackRequest :GiftBackRequestVM){

   
    return this.httpReq.postAuthRequest('GiftBackRequest/ValidateGiftBackRequest', giftBackRequest).toPromise().then(

      result =>{

        let replieslist = (result as GenericVm<Array<GiftBackBookVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftBackRequestVM>>).messages;
        
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

  updateRequest(giftBackRequest :GiftBackRequestVM){

    this.globals.Spinner = true;
    giftBackRequest.isArchived = false;
    giftBackRequest.updatedBy = this.globals.getCurrentUserId();
    giftBackRequest.updatedDate = new Date();
    return this.httpReq.postAuthRequest('GiftBackRequest/UpdateGiftBackRequest', giftBackRequest).toPromise().then()
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
    return this.httpReq.GetAuthRequest('GiftBackRequest/GetGiftBackRequestById/'+RequestId+'/'+userId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<GiftBackRequestVM>).data;
        this.globals.messages = (result as GenericVm<GiftBackRequestVM>).messages;
        
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

  createNewComment(giftBackComment :GiftBackCommentVM){

    this.globals.Spinner = true;
    giftBackComment.createdBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('GiftBackRequest/CreateNewRequestComment', giftBackComment).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for deleting an existing gift back request
  deleteGiftBackRequest(giftBackRequest: GiftBackRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('giftBackRequest/DeleteGiftBackRequest', giftBackRequest).toPromise().then()
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




