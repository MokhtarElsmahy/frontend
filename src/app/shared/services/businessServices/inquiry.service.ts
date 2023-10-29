import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { InquiryVM } from '../../models/VM/businessServices/InquiryVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class InquiryService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting an inquiry requests by id
  getInquiryById(inquiryId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('inquiry/GetInquiryById/'+inquiryId+'/'+userId).toPromise().then(
      result => {
        let inquiry = (result as GenericVm<InquiryVM>).data;
        this.globals.messages = (result as GenericVm<InquiryVM>).messages;
        
        return inquiry;
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

  //Method to handle calling the Post API responsible for creating a new inquiry
  createNewInquiry(inquiry: InquiryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('inquiry/CreateNewInquiry', inquiry).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing inquiry
  updateInquiry(inquiry: InquiryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('inquiry/UpdateInquiry', inquiry).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing inquiry to be archived
  addToArchivedAndUpdateInquiry(inquiry: InquiryVM) {
    this.globals.Spinner = true;
    inquiry.isArchived = true;
    inquiry.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('inquiry/UpdateInquiry', inquiry).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing inquiry to be unarchived
  unArchiveAndUpdateInquiry(inquiry: InquiryVM) {
    this.globals.Spinner = true;
    inquiry.isArchived = false;
    inquiry.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('inquiry/UpdateInquiry', inquiry).toPromise().then()
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous inquiry requests
  getInquiriesList(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('inquiry/GetAllInquiries/'+userId).toPromise().then(
      result => {
        let inquirysList = (result as GenericVm<Array<InquiryVM>>).data;
        this.globals.messages = (result as GenericVm<Array<InquiryVM>>).messages;
        
        return inquirysList;
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous archived inquiry requests
  getArchivedInquiriesList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('inquiry/GetArchivedInquiries/'+userId).toPromise().then(
      result => {
        let inquirysList = (result as GenericVm<Array<InquiryVM>>).data;
        this.globals.messages = (result as GenericVm<Array<InquiryVM>>).messages;
        
        return inquirysList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing inquiry
  deleteInquiry(inquiry: InquiryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('inquiry/DeleteInquiry', inquiry).toPromise().then()
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