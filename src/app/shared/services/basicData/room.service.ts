import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { RoomVM } from '../../models/VM/basicData/RoomVM';

@Injectable({
    providedIn: 'root'
  })
export class RoomService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a Rooms by id
  getRoomById(RoomId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Room/GetRoomById/'+RoomId).toPromise().then(
      result => {
        let Room = (result as GenericVm<RoomVM>).data;
        this.globals.messages = (result as GenericVm<RoomVM>).messages;
        
        return Room;
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

  //Method to handle calling the Post API responsible for creating a new Room
  createNewRoom(Room: RoomVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Room/CreateNewRoom', Room).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing Room
  updateRoom(room: RoomVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Room/UpdateRoom', room).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the user saved Rooms
  getRoomsList(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Room/GetAllRooms/').toPromise().then(
      result => {
        let RoomsList = (result as GenericVm<Array<RoomVM>>).data;
        this.globals.messages = (result as GenericVm<Array<RoomVM>>).messages;
        
        return RoomsList;
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

  //Method to handle calling the Get API responsible for getting the list of Rooms belonging to a specific library
  getRoomsByLibraryId(libraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Room/GetRoomsByLibraryId/'+libraryId).toPromise().then(
      result => {
        let RoomsList = (result as GenericVm<Array<RoomVM>>).data;
        this.globals.messages = (result as GenericVm<Array<RoomVM>>).messages;
        
        return RoomsList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing Room
  deleteRoom(room: RoomVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('Room/DeleteRoom', room).toPromise().then()
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