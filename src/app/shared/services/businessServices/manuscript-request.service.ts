import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { ManuscriptVM } from '../../models/VM/businessServices/ManuscriptVM';
import { GiftBackCommentVM } from '../../models/VM/businessServices/GiftBackCommentVM';


@Injectable({
  providedIn: 'root'
})
export class ManuscriptRequestService {

  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  createNewManuscriptRequest(ManuscriptVM: ManuscriptVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ManuscriptRequest/CreateNewManuscriptRequest', ManuscriptVM).toPromise().then()
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

  updateManuscriptRequest(ManuscriptVM: ManuscriptVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ManuscriptRequest/UpdateManuscriptRequest', ManuscriptVM).toPromise().then()
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

  Archive(ManuscriptVM: ManuscriptVM){
    this.globals.Spinner = true;
    ManuscriptVM.isArchived = true;
    ManuscriptVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('ManuscriptRequest/ArchiveUnArchiveManuscriptRequest/',ManuscriptVM).toPromise().then()
    .catch(
      error=>{
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

  Unarchive(ManuscriptVM: ManuscriptVM){
    this.globals.Spinner = true;
    ManuscriptVM.isArchived = false;
    ManuscriptVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('ManuscriptRequest/ArchiveUnArchiveManuscriptRequest/',ManuscriptVM).toPromise().then()
    .catch(
      error=>{
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

  getManuscriptRequestById(Id: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ManuscriptRequest/GetManuscriptRequestById/'+Id+'/'+userId).toPromise().then(
      result => {
        let Request = (result as GenericVm<ManuscriptVM>).data;
        this.globals.messages = (result as GenericVm<ManuscriptVM>).messages;
        
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

  getAllManuscriptRequests(userId:string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ManuscriptRequest/GetAllManuscriptRequests/'+userId).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<ManuscriptVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ManuscriptVM>>).messages;
        
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


  getArchivedManuscriptRequests(userId:string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ManuscriptRequest/GetArchivedManuscriptRequests/'+userId).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<ManuscriptVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ManuscriptVM>>).messages;
        
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


  Upload(ManuscriptVM: FormData){
    this.globals.Spinner = true;
  
    return this.httpReq.postAuthFile('ManuscriptRequest/SaveFile/',ManuscriptVM,).toPromise().then()
    .catch(
      error=>{
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



  Download(id : number ,userId:string){
    this.globals.Spinner = true;
  
    return this.httpReq.GetRequestFile('ManuscriptRequest/DownloadFile/'+id+'/'+userId).toPromise().then()
    .catch(
      error=>{
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
    return this.httpReq.GetAuthRequest('ManuscriptRequest/GetAllRequestComment/'+RequestId).toPromise().then(
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

  createNewComment(giftBackComment :GiftBackCommentVM){

    this.globals.Spinner = true;
    giftBackComment.createdBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('ManuscriptRequest/CreateNewRequestComment', giftBackComment).toPromise().then()
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
