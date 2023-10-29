import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { SuggestionVM } from '../../models/VM/businessServices/SuggestionVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class SuggestionService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a suggestion requests by id
  getSuggestionById(suggestionId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('suggestion/GetSuggestionById/'+suggestionId+'/'+userId).toPromise().then(
      result => {
        let suggestion = (result as GenericVm<SuggestionVM>).data;
        this.globals.messages = (result as GenericVm<SuggestionVM>).messages;
        
        return suggestion;
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

  //Method to handle calling the Post API responsible for creating a new suggestion
  createNewSuggestion(suggestion: SuggestionVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('suggestion/CreateNewSuggestion', suggestion).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing suggestion
  updateSuggestion(suggestion: SuggestionVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('suggestion/UpdateSuggestion', suggestion).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing suggestion to be archived
  addToArchivedAndUpdateSuggestion(suggestion: SuggestionVM) {
    this.globals.Spinner = true;
    suggestion.isArchived = true;
    suggestion.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('suggestion/UpdateSuggestion', suggestion).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing suggestion to be unarchived
  unArchiveAndUpdateSuggestion(suggestion: SuggestionVM) {
    this.globals.Spinner = true;
    suggestion.isArchived = false;
    suggestion.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('suggestion/UpdateSuggestion', suggestion).toPromise().then()
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
      
  //Method to handle calling the Get API responsible for getting the list view of the user previous suggestion requests
  getSuggestionsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('suggestion/GetAllSuggestions/'+userId).toPromise().then(
      result => {
        let suggestionsList = (result as GenericVm<Array<SuggestionVM>>).data;
        this.globals.messages = (result as GenericVm<Array<SuggestionVM>>).messages;
        
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

  //Method to handle calling the Get API responsible for getting the list view of the user previous archived suggestion requests
  getArchivedSuggestionsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('suggestion/GetArchivedSuggestions/'+userId).toPromise().then(
      result => {
        let suggestionsList = (result as GenericVm<Array<SuggestionVM>>).data;
        this.globals.messages = (result as GenericVm<Array<SuggestionVM>>).messages;
        
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
  
  //Method to handle calling the Post API responsible for deleting an existing suggestion
  deleteSuggestion(suggestion: SuggestionVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('suggestion/DeleteSuggestion', suggestion).toPromise().then()
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