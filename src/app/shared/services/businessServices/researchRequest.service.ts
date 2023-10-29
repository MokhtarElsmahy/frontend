import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { ResearchRequestVM } from '../../models/VM/businessServices/ResearchRequestVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { ResearchAvailableDateVM } from '../../models/VM/basicData/ResearchAvailableDateVM';
import { RoomAvailableDayVM } from '../../models/VM/basicData/RoomAvailableDayVM';
import { CommonVM } from '../../models/VM/CommonVM';
import { ResearchDatesGeneratorVM } from '../../models/VM/ResearchDatesGeneratorVM';
import { ResearchRequestReplyVM } from '../../models/VM/businessServices/ResearchRequestReplyVM';

@Injectable({
    providedIn: 'root'
  })
export class ResearchRequestService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a research request requests by id
  getResearchRequestById(researchRequestId: number, userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetResearchRequestById/'+researchRequestId+'/'+userId).toPromise().then(
      result => {
        let ResearchRequest = (result as GenericVm<ResearchRequestVM>).data;
        this.globals.messages = (result as GenericVm<ResearchRequestVM>).messages;
        
        return ResearchRequest;
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

  //Method to handle calling the Get API responsible for getting the list of the previous research request replies
  getAllResearchRequestReplies(researchRequestId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetAllResearchRequestReplies/'+researchRequestId).toPromise().then(
      result => {
        let replieslist = (result as GenericVm<Array<ResearchRequestReplyVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ResearchRequestReplyVM>>).messages;
        
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

  //Method to handle calling the Post API responsible for creating a new research request
  createNewResearchRequest(researchRequest: ResearchRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/CreateNewResearchRequest', researchRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for creating a new research request reply
  createNewResearchRequestReply(researchRequestReply: ResearchRequestReplyVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/CreateNewResearchRequestReply', researchRequestReply).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing research request
  updateResearchRequest(researchRequest: ResearchRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/UpdateResearchRequest', researchRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing research request to be archived
  addToArchivedAndUpdateResearchRequest(researchRequest: ResearchRequestVM) {
    this.globals.Spinner = true;
    researchRequest.isArchived = true;
    researchRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('researchRequest/UpdateResearchRequest', researchRequest).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing research request to be unarchived
  unArchiveAndUpdateResearchRequest(researchRequest: ResearchRequestVM) {
    this.globals.Spinner = true;
    researchRequest.isArchived = false;
    researchRequest.updatedBy = this.globals.getCurrentUserId();
    return this.httpReq.postAuthRequest('researchRequest/UpdateResearchRequest', researchRequest).toPromise().then()
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous research request
  getAllResearchRequests(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetAllResearchRequests/'+userId).toPromise().then(
      result => {
        let ResearchlistToView = (result as GenericVm<Array<ResearchRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ResearchRequestVM>>).messages;
        
        return ResearchlistToView;
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
  
  //Method to handle calling the Get API responsible for getting the list view of the user previous archived research request requests
  getArchivedResearchRequestsList(userId){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('researchRequest/GetArchivedResearchRequests/'+userId).toPromise().then(
      result => {
        let researchRequestsList = (result as GenericVm<Array<ResearchRequestVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ResearchRequestVM>>).messages;
        
        return researchRequestsList;
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
  

  //Method to handle calling the Post API responsible for deleting an existing research request
  deleteResearchRequest(researchRequest: ResearchRequestVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('ResearchRequest/DeleteResearchRequest', researchRequest).toPromise().then()
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

  //Method to handle calling the Post API Generates new research available date to a specific room in the system
  generateNewResearchAvailableDate(generatedDatesVM: ResearchDatesGeneratorVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/GenerateNewResearchAvailableDate', generatedDatesVM).toPromise().then()
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
  
  //Method to handle calling the Post API Generates new research available dates to a specific room in the system within start and end dates
  generateNewResearchAvailableDatesRange(generatedDatesVM: ResearchDatesGeneratorVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/GenerateNewResearchAvailableDatesRange', generatedDatesVM).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the room available days by room id
  getRoomAvailableDaysByRoomId(roomId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetRoomAvailableDaysByRoomId/'+roomId).toPromise().then(
      result => {
        let ResearchAvailableDatesList = (result as GenericVm<Array<RoomAvailableDayVM>>).data;
        this.globals.messages = (result as GenericVm<Array<RoomAvailableDayVM>>).messages;
        
        return ResearchAvailableDatesList;
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

  //Method to handle calling the Post API responsible for updating an existing research request
  updateRoomAvailableDays(roomAvailableDaysVM: Array<RoomAvailableDayVM>){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('ResearchRequest/UpdateRoomAvailableDays', roomAvailableDaysVM).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the research available dates by room id
  getResearchAvailableDatesByRoomId(roomId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetResearchAvailableDatesByRoomId/'+roomId).toPromise().then(
      result => {
        let ResearchAvailableDatesList = (result as GenericVm<Array<ResearchAvailableDateVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ResearchAvailableDateVM>>).messages;
        
        return ResearchAvailableDatesList;
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

  //Method to handle calling the Get API responsible for getting the list view of all the research dates by room id
  getAllRoomResearchDatesByRoomId(roomId: number, startDate?: string, endDate?: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetAllRoomResearchDatesByRoomId/'+roomId+'/'+startDate+'/'+endDate).toPromise().then(
      result => {
        let ResearchAvailableDatesList = (result as GenericVm<Array<ResearchAvailableDateVM>>).data;
        this.globals.messages = (result as GenericVm<Array<ResearchAvailableDateVM>>).messages;
        
        return ResearchAvailableDatesList;
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

  //Method to handle calling the Get API responsible for getting the list of request types
  getResearchRequestTypes(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetResearchRequestTypes/').toPromise().then(
      result => {
        let TypesList = (result as GenericVm<Array<CommonVM>>).data;
        this.globals.messages = (result as GenericVm<Array<CommonVM>>).messages;
        
        return TypesList;
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

  //Method to handle calling the Get API responsible for getting the list of grades
  getGrades(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ResearchRequest/GetGrades/').toPromise().then(
      result => {
        let TypesList = (result as GenericVm<Array<CommonVM>>).data;
        this.globals.messages = (result as GenericVm<Array<CommonVM>>).messages;
        
        return TypesList;
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

  //Method to handle calling the Post API responsible for deleting an existing research available date
  deleteResearchAvailableDate(researchAvailableDate: ResearchAvailableDateVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('ResearchRequest/DeleteResearchAvailableDate', researchAvailableDate).toPromise().then()
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