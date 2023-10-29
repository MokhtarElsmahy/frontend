import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { PeriodVM } from '../../models/VM/basicData/PeriodVM';

@Injectable({
    providedIn: 'root'
  })
export class PeriodService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a Periods by id
  getPeriodById(PeriodId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Period/GetPeriodById/'+PeriodId).toPromise().then(
      result => {
        let Period = (result as GenericVm<PeriodVM>).data;
        this.globals.messages = (result as GenericVm<PeriodVM>).messages;
        
        return Period;
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

  //Method to handle calling the Post API responsible for creating a new Period
  createNewPeriod(Period: PeriodVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Period/CreateNewPeriod', Period).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing Period
  updatePeriod(period: PeriodVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Period/UpdatePeriod', period).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the user saved Periods
  getPeriodsList(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Period/GetAllPeriods/').toPromise().then(
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

  //Method to handle calling the Get API responsible for getting the list of Periods
  getPeriodsByLibraryId(libraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Period/GetPeriodsByLibraryId/'+libraryId).toPromise().then(
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

  //Method to handle calling the Get API responsible for checking the deletability of some Period
  isPeriodDeletable(periodId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Period/IsPeriodDeletable/'+periodId).toPromise().then(
      result => {
        let isDeletable = (result as GenericVm<boolean>).data;
        this.globals.messages = (result as GenericVm<boolean>).messages;
        
        return isDeletable;
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
  
  //Method to handle calling the Post API responsible for deleting an existing Period
  deletePeriod(period: PeriodVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('Period/DeletePeriod', period).toPromise().then()
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