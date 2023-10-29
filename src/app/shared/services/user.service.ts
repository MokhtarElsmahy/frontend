import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from './global.service'; 
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { UserVM } from '../models/VM/UserVM';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { MyRequestModel } from '../models/VM/MyRequestModel';
import { UserRoleVM } from '../models/VM/Request/UserRoleVM';
import { UserRegisterationVM } from '../models/VM/UserRegisterationVM';

@Injectable({
    providedIn: 'root'
  })
export class UserService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a user requests by id
  getUserById(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetUserById/'+userId).toPromise().then(
      result => {
        let user = (result as GenericVm<UserVM>).data;
        this.globals.messages = (result as GenericVm<UserVM>).messages;
        
        return user;
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

  Deactivate(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/DeactivateUserProfile/'+userId).toPromise().then(
      result => {
        let res = (result as GenericVm<boolean>).data;
        this.globals.messages = (result as GenericVm<boolean>).messages;
        
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

  
  //Method to handle calling the Get API responsible for getting the list view of all the users existing in the system databases
  getAllUsers(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetAllUsers/').toPromise().then(
      result => {
        let usersList = (result as GenericVm<Array<UserVM>>).data;
        this.globals.messages = (result as GenericVm<Array<UserVM>>).messages;
        
        return usersList;
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
  
  //Method to handle calling the Post API responsible for setting or unsetting user role
  setUserRole(userRole: UserRoleVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('user/SetUserRole', userRole).toPromise().then()
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

  //Method to handle calling the Get API responsible for updating the user active status
  updateActiveStatus(userId: string, isActive: boolean){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/UpdateUserActiveStatus/'+userId+'/'+isActive).toPromise().then(
      result => {
        let response = (result as GenericVm<string>).data;
        this.globals.messages = (result as GenericVm<string>).messages;
        
        return response;
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

  //Method to handle calling the Get API responsible for getting the list view of the user all previous requests
  getUserRequestsList(userId: string){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetAllUserRequests/'+userId).toPromise().then(
      result => {
        let requestsList = (result as GenericVm<Array<MyRequestModel>>).data;
        this.globals.messages = (result as GenericVm<Array<MyRequestModel>>).messages;
        
        return requestsList;
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

  //Method to handle calling the Post API responsible for updating an existing user information
  updateUserInfo(user: UserVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('user/UpdateUserInfo', user).toPromise().then()
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

  //Method to handle calling the Post API responsible for updating an existing user profile
  updateUserProfile(userData: FormData){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('user/UpdateUserProfile', userData).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the number of the employees existed in the system
  getSystemEmployeesCount(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetSystemEmployeesCount').toPromise().then(
      result => {
        let count = (result as GenericVm<number>).data;
        this.globals.messages = (result as GenericVm<number>).messages;
        
        return count;
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

  //Method to handle calling the Get API responsible for getting the number of the visitors existed in the system
  getSystemVisitorsCount(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetSystemVisitorsCount').toPromise().then(
      result => {
        let count = (result as GenericVm<number>).data;
        this.globals.messages = (result as GenericVm<number>).messages;
        
        return count;
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

  //Method to handle calling the Get API responsible for getting the number of all requests saved in the system
  getNumberOfAllSystemRequests(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('user/GetNumberOfAllSystemRequests').toPromise().then(
      result => {
        let count = (result as GenericVm<number>).data;
        this.globals.messages = (result as GenericVm<number>).messages;
        
        return count;
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

  //Method to handle calling the Post API responsible for deleting an existing user
  deleteUser(user: UserVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('user/DeleteUser', user).toPromise().then()
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