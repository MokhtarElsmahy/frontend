import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { GiftRequestVM } from '../../models/VM/businessServices/GiftRequestVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { GiftedBookVM } from '../../models/VM/businessServices/GiftedBookVM';
import { GiftRequestReplyVM } from '../../models/VM/businessServices/GiftRequestReplyVM';

@Injectable({
    providedIn: 'root'
  })
export class GiftRequestService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a gift request requests by id
  getGiftRequestById(suggestionId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('giftRequest/GetGiftRequestById/'+suggestionId+'/'+userId).toPromise().then(
      result => {
        let giftRequest = (result as GenericVm<GiftRequestVM>).data;
        this.globals.messages = (result as GenericVm<GiftRequestVM>).messages;
        
        return giftRequest;
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

  //Method to handle calling the Post API responsible for creating a new giftRequest
  createNewGiftRequest(giftRequest: GiftRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('giftRequest/CreateNewGiftRequest', giftRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for creating a new giftRequest with excel sheet of gifted books
  createNewGiftRequestWithBooksSheet(giftRequest: FormData){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('giftRequest/CreateNewGiftRequestWithBooksSheet', giftRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing gift request
  updateGiftRequest(giftRequest: GiftRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('giftRequest/UpdateGiftRequest', giftRequest).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing gift request to be archived
  addToArchivedAndUpdateGiftRequest(giftRequest: GiftRequestVM) {
    this.globals.Spinner = true;
    giftRequest.isArchived = true;
    giftRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('giftRequest/UpdateGiftRequest', giftRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing gift request to be unarchived
  unArchiveAndUpdateGiftRequest(giftRequest: GiftRequestVM) {
    this.globals.Spinner = true;
    giftRequest.isArchived = false;
    giftRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('giftRequest/UpdateGiftRequest', giftRequest).toPromise().then()
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
      
  //Method to handle calling the Get API responsible for getting the list view of the user previous gift request requests
  getGiftRequestsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('giftRequest/GetAllGiftRequests/'+userId).toPromise().then(
      result => {
        let suggestionsList = (result as GenericVm<Array<GiftRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftRequestVM>>).messages;
        
        return suggestionsList;
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

  //Method to handle calling the Get API responsible for getting the list view of the user previous archived gift request requests
  getArchivedGiftRequestsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('giftRequest/GetArchivedGiftRequests/'+userId).toPromise().then(
      result => {
        let suggestionsList = (result as GenericVm<Array<GiftRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftRequestVM>>).messages;
        
        return suggestionsList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing gift request
  deleteGiftRequest(giftRequest: GiftRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('giftRequest/DeleteGiftRequest', giftRequest).toPromise().then()
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
  
  
  //Method to handle calling the Get API responsible for getting the list view of the user previously gifted books
  getGiftedBooksList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('giftedBook/GetAllBooks/'+userId).toPromise().then(
      result => {
        let suggestionsList = (result as GenericVm<Array<GiftedBookVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftedBookVM>>).messages;
        
        return suggestionsList;
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

  //Method to handle calling the Post API responsible for deleting an existing gifted book
  deleteGiftedBook(giftedBook: GiftedBookVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('giftedBook/DeleteBook', giftedBook).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing gift request
  updateGiftedBooksList(booksList: GiftedBookVM[]){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('giftedBook/UpdateBooksList', booksList).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list of the previous gift request replies
  getAllGiftRequestReplies(giftRequestId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('GiftRequest/GetAllGiftRequestReplies/'+giftRequestId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<GiftRequestReplyVM>>).data;
        this.globals.messages = (result as GenericVm<Array<GiftRequestReplyVM>>).messages;
        
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

  //Method to handle calling the Post API responsible for creating a new gift requestReply
  createNewGiftRequestReply(giftRequestReply: GiftRequestReplyVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('GiftRequest/CreateNewGiftRequestReply', giftRequestReply).toPromise().then()
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