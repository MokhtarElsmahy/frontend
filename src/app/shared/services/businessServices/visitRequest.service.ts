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

@Injectable({
    providedIn: 'root'
  })
export class VisitRequestService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a visit request requests by id
  getVisitRequestById(visitRequestId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetVisitRequestById/'+visitRequestId+'/'+userId).toPromise().then(
      result => {
        let VisitRequest = (result as GenericVm<VisitRequestVM>).data;
        this.globals.messages = (result as GenericVm<VisitRequestVM>).messages;
        
        return VisitRequest;
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

  //Method to handle calling the Get API responsible for getting the list of the previous visit request replies
  getAllVisitRequestReplies(visitRequestId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetAllVisitRequestReplies/'+visitRequestId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<VisitRequestReplyVM>>).data;
        this.globals.messages = (result as GenericVm<Array<VisitRequestReplyVM>>).messages;
        
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

  //Method to handle calling the Post API responsible for creating a new visit request
  createNewVisitRequest(visitRequest: VisitRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/CreateNewVisitRequest', visitRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for creating a new visit requestReply
  createNewVisitRequestReply(visitRequestReply: VisitRequestReplyVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/CreateNewVisitRequestReply', visitRequestReply).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing visit request
  updateVisitRequest(visitRequest: VisitRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/UpdateVisitRequest', visitRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing visit request to be archived
  addToArchivedAndUpdateVisitRequest(visitRequest: VisitRequestVM) {
    this.globals.Spinner = true;
    visitRequest.isArchived = true;
    visitRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('visitRequest/UpdateVisitRequest', visitRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing visit request to be unarchived
  unArchiveAndUpdateVisitRequest(visitRequest: VisitRequestVM) {
    this.globals.Spinner = true;
    visitRequest.isArchived = false;
    visitRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('visitRequest/UpdateVisitRequest', visitRequest).toPromise().then()
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous visit request
  getAllVisitRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetAllVisitRequests/'+userId).toPromise().then(
      result => {
        let VisitlistToView = (result as GenericVm<Array<VisitRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<VisitRequestVM>>).messages;
        
        return VisitlistToView;
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous archived visit request requests
  getArchivedVisitRequestsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('visitRequest/GetArchivedVisitRequests/'+userId).toPromise().then(
      result => {
        let visitRequestsList = (result as GenericVm<Array<VisitRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<VisitRequestVM>>).messages;
        
        return visitRequestsList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing visit request
  deleteVisitRequest(visitRequest: VisitRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('VisitRequest/DeleteVisitRequest', visitRequest).toPromise().then()
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

  //Method to handle calling the Post API Generates new visit available date to a specific library in the system
  generateNewVisitAvailableDate(generatedDatesVM: VisitDatesGeneratorVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/GenerateNewVisitAvailableDate', generatedDatesVM).toPromise().then()
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
  
  //Method to handle calling the Post API Generates new visit available dates to a specific library in the system within start and end dates
  generateNewVisitAvailableDatesRange(generatedDatesVM: VisitDatesGeneratorVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/GenerateNewVisitAvailableDatesRange', generatedDatesVM).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the library available days by library id
  getLibraryAvailableDaysByLibraryId(libraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetLibraryAvailableDaysByLibraryId/'+libraryId).toPromise().then(
      result => {
        let VisitAvailableDatesList = (result as GenericVm<Array<LibraryAvailableDayVM>>).data;
        this.globals.messages = (result as GenericVm<Array<LibraryAvailableDayVM>>).messages;
        
        return VisitAvailableDatesList;
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

  //Method to handle calling the Post API responsible for updating an existing visit request
  updateLibraryAvailableDays(libraryAvailableDaysVM: Array<LibraryAvailableDayVM>){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('VisitRequest/UpdateLibraryAvailableDays', libraryAvailableDaysVM).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the visit available dates by library id
  getVisitAvailableDatesByLibraryId(libraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetVisitAvailableDatesByLibraryId/'+libraryId).toPromise().then(
      result => {
        let VisitAvailableDatesList = (result as GenericVm<Array<VisitAvailableDateVM>>).data;
        this.globals.messages = (result as GenericVm<Array<VisitAvailableDateVM>>).messages;
        
        return VisitAvailableDatesList;
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

  //Method to handle calling the Get API responsible for getting the list view of all the visit dates by library id
  getAllLibraryVisitDatesByLibraryId(libraryId: number, startDate?: string, endDate?: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetAllLibraryVisitDatesByLibraryId/'+libraryId+'/'+startDate+'/'+endDate).toPromise().then(
      result => {
        let VisitAvailableDatesList = (result as GenericVm<Array<VisitAvailableDateVM>>).data;
        this.globals.messages = (result as GenericVm<Array<VisitAvailableDateVM>>).messages;
        
        return VisitAvailableDatesList;
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

  //Method to handle calling the Get API responsible for getting the list of days periods
  getAllDaysPeriods(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetAllDaysPeriods/').toPromise().then(
      result => {
        let PeriodsList = (result as GenericVm<Array<PeriodVM>>).data;
        this.globals.messages = (result as GenericVm<Array<PeriodVM>>).messages;
        
        return PeriodsList;
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

  //Method to handle calling the Get API responsible for getting the list of available day periods by selected date
  getVisitAvailablePeriodsByDate(selectedDate: string, libraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetVisitAvailablePeriodsByDate/'+selectedDate+'/'+libraryId).toPromise().then(
      result => {
        let PeriodsList = (result as GenericVm<Array<PeriodVM>>).data;
        this.globals.messages = (result as GenericVm<Array<PeriodVM>>).messages;
        
        return PeriodsList;
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

  //Method to handle calling the Get API responsible for getting the list of days periods by selected date
  getVisitAllPeriodsByDate(selectedDate: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('VisitRequest/GetVisitAllPeriodsByDate/'+selectedDate).toPromise().then(
      result => {
        let PeriodsList = (result as GenericVm<Array<PeriodVM>>).data;
        this.globals.messages = (result as GenericVm<Array<PeriodVM>>).messages;
        
        return PeriodsList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing visit available date
  deleteVisitAvailableDate(visitAvailableDate: VisitAvailableDateVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('VisitRequest/DeleteVisitAvailableDate', visitAvailableDate).toPromise().then()
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