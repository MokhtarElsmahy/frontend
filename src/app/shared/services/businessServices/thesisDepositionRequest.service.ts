import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { ThesisDepositionRequestVM } from '../../models/VM/businessServices/ThesisDepositionRequestVM';
import { UniversityVM } from '../../models/VM/basicData/UniversityVM';
import { ThesisDepositionRequestReplyVM } from '../../models/VM/businessServices/ThesisDepositionRequestReplyVM';

@Injectable({
    providedIn: 'root'
  })
export class ThesisDepositionRequestService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a thesis deposition request by id
  getThesisDepositionRequestById(ThesisDepositionRequestId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ThesisDepositionRequest/GetThesisDepositionRequestById/'+ThesisDepositionRequestId+'/'+userId).toPromise().then(
      result => {
        let ThesisDepositionRequest = (result as GenericVm<ThesisDepositionRequestVM>).data;
        this.globals.messages = (result as GenericVm<ThesisDepositionRequestVM>).messages;
        
        return ThesisDepositionRequest;
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

  //Method to handle calling the Get API responsible for getting the list of the previous thesis deposition request replies
  getAllThesisDepositionRequestReplies(thesisDepositionRequestId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ThesisDepositionRequest/GetAllThesisDepositionRequestReplies/'+thesisDepositionRequestId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<ThesisDepositionRequestReplyVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ThesisDepositionRequestReplyVM>>).messages;
        
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
  
  //Method to handle calling the Post API responsible for creating a new thesis deposition requestReply
  createNewThesisDepositionRequestReply(thesisDepositionRequestReply: ThesisDepositionRequestReplyVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ThesisDepositionRequest/CreateNewThesisDepositionRequestReply', thesisDepositionRequestReply).toPromise().then()
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

  //Method to handle calling the Post API responsible for creating a new thesis deposition request
  createNewThesisDepositionRequest(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ThesisDepositionRequest/CreateNewThesisDepositionRequest', thesisDepositionRequest).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing thesis deposition request
  updateThesisDepositionRequest(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ThesisDepositionRequest/UpdateThesisDepositionRequest', thesisDepositionRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for creating or updating thesis deposition request with attachments
  createOrUpdateThesisDepositionRequestWithAttachments(thesisData: FormData){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('ThesisDepositionRequest/CreateOrUpdateThesisDepositionRequestWithAttachments', thesisData).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing thesisDepositionRequest to be archived
  addToArchivedAndUpdateThesisDepositionRequest(thesisDepositionRequest: ThesisDepositionRequestVM) {
    this.globals.Spinner = true;
    thesisDepositionRequest.isArchived = true;
    thesisDepositionRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('thesisDepositionRequest/UpdateThesisDepositionRequest', thesisDepositionRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing thesisDepositionRequest to be unarchived
  unArchiveAndUpdateThesisDepositionRequest(thesisDepositionRequest: ThesisDepositionRequestVM) {
    this.globals.Spinner = true;
    thesisDepositionRequest.isArchived = false;
    thesisDepositionRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('thesisDepositionRequest/UpdateThesisDepositionRequest', thesisDepositionRequest).toPromise().then()
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user saved thesis deposition requests
  getAllThesisDepositionRequests(userId: string,isOutsideKingdom :boolean){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ThesisDepositionRequest/GetAllThesisDepositionRequests/'+userId+'/'+isOutsideKingdom).toPromise().then(
      result => {
        let ThesisDepositionRequestsList = (result as GenericVm<Array<ThesisDepositionRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ThesisDepositionRequestVM>>).messages;
        
        return ThesisDepositionRequestsList;
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

  //Method to handle calling the Get API responsible for getting the list of universities saved in the system databases
  getAllUniversities(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ThesisDepositionRequest/GetAllUniversities/').toPromise().then(
      result => {
        let UniversitiesList = (result as GenericVm<Array<UniversityVM>>).data;
        this.globals.messages = (result as GenericVm<Array<UniversityVM>>).messages;
        
        return UniversitiesList;
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous archived thesisDepositionRequest requests
  getArchivedThesisDepositionRequestsList(userId,isOutsideKingdom){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('thesisDepositionRequest/GetArchivedThesisDepositionRequests/'+userId+'/'+isOutsideKingdom).toPromise().then(
      result => {
        let thesisDepositionRequestsList = (result as GenericVm<Array<ThesisDepositionRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ThesisDepositionRequestVM>>).messages;
        
        return thesisDepositionRequestsList;
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
  

  //Method to handle calling the Post API responsible for deleting an existing thesis deposition request
  deleteThesisDepositionRequest(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('ThesisDepositionRequest/DeleteThesisDepositionRequest', thesisDepositionRequest).toPromise().then()
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