import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { ServiceRatingVM } from '../../models/VM/businessServices/ServiceRatingVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class ServiceRatingService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a service rating requests by id
  getServiceRatingByUserId(userId: string, serviceType: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('ServiceRating/GetServiceRatingByUserId/'+userId+'/'+serviceType).toPromise().then(
      result => {
        let serviceRating = (result as GenericVm<ServiceRatingVM>).data;
        this.globals.messages = (result as GenericVm<ServiceRatingVM>).messages;
        
        return serviceRating;
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

  //Method to handle calling the Post API responsible for creating new or updating a service rating
  createOrUpdateServiceRating(serviceRating: ServiceRatingVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('serviceRating/CreateOrUpdateServiceRating', serviceRating).toPromise().then()
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