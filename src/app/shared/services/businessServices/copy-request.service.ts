import { Injectable , OnInit,Component } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import {CopyRequestVM} from '../../models/VM/businessServices/CopyRequestVM'
import { GiftBackCommentVM } from '../../models/VM/businessServices/GiftBackCommentVM';
import { CopyRequestSearchRequestVM } from '../../models/VM/businessServices/CopyRequestSearchRequestVM';
import { CopyRequestSearchResponseVM } from '../../models/VM/businessServices/CopyRequestSearchResponseVM';
import { MedadLibVM } from '../../models/VM/businessServices/MedadLibVM';
@Injectable({
  providedIn: 'root'
})
export class CopyRequestService {

  SelectedBookTitle : string
  IsConfirmed : boolean = false;

  MedadLibId :string
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }


  SetMedadLibId(value : string){
    this.MedadLibId = value;
  }

  GetMedadLibId(){
   return this.MedadLibId 
  }

  SetIsConfirmed(value : boolean){
    this.IsConfirmed = value;
  }

  GetIsConfirmed(){
    return this.IsConfirmed ;
  }

  SetSelectedBookTitle(value : string){
    this.SelectedBookTitle = value;
  }

  GetSelectedBookTitle(){
    return this.SelectedBookTitle ;
  }


  createNewCopyRequest(CopyRequestVM: CopyRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('CopyRequest/CreateNewCopyRequest', CopyRequestVM).toPromise().then()
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

  updateCopyRequest(CopyRequestVM: CopyRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('CopyRequest/UpdateCopyRequest', CopyRequestVM).toPromise().then()
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

  Archive(CopyRequestVM: CopyRequestVM){
    this.globals.Spinner = true;
    CopyRequestVM.isArchived = true;
    CopyRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('CopyRequest/ArchiveUnArchiveCopyRequest/',CopyRequestVM).toPromise().then()
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

  Unarchive(CopyRequestVM: CopyRequestVM){
    this.globals.Spinner = true;
    CopyRequestVM.isArchived = false;
    CopyRequestVM.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('CopyRequest/ArchiveUnArchiveCopyRequest/',CopyRequestVM).toPromise().then()
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

  getCopyRequestById(Id: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('CopyRequest/GetCopyRequestById/'+Id+'/'+userId).toPromise().then(
      result => {
        let Request = (result as GenericVm<CopyRequestVM>).data;
        this.globals.messages = (result as GenericVm<CopyRequestVM>).messages;
        
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

  getAllCopyRequests(userId:string,IsOutsideKingdom:boolean){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('CopyRequest/GetAllCopyRequests/'+userId+'/'+IsOutsideKingdom).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<CopyRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<CopyRequestVM>>).messages;
        
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


  getArchivedCopyRequests(userId:string,IsOutsideKingdom:boolean){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('CopyRequest/GetArchivedCopyRequests/'+userId+'/'+IsOutsideKingdom).toPromise().then(
      result => {
        let List = (result as GenericVm<Array<CopyRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<CopyRequestVM>>).messages;
        
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


  Upload(CopyRequestVM: FormData){
    this.globals.Spinner = true;
  
    return this.httpReq.postAuthFile('CopyRequest/SaveFile/',CopyRequestVM,).toPromise().then()
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
  
    return this.httpReq.GetRequestFile('CopyRequest/DownloadFile/'+id+'/'+userId).toPromise().then()
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
    return this.httpReq.GetAuthRequest('CopyRequest/GetAllRequestComment/'+RequestId).toPromise().then(
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
    return this.httpReq.postAuthRequest('CopyRequest/CreateNewRequestComment', giftBackComment).toPromise().then()
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


  SearchBooks(searchVM: CopyRequestSearchRequestVM) {
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('CopyRequest/GetSimpleSearchResponse/',searchVM).toPromise().then(
      result => {
        let res = (result as GenericVm<CopyRequestSearchResponseVM>).data;
        this.globals.messages = (result as GenericVm<CopyRequestSearchResponseVM>).messages;
        
        return res;
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

  GetMedadLibs(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('CopyRequest/GetMedadLibs').toPromise().then(
      result => {
        let replieslist = (result as GenericVm<MedadLibVM>).data;
        this.globals.messages = (result as GenericVm<MedadLibVM>).messages;
        
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
