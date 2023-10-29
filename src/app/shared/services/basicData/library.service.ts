import { Component, Injectable, OnInit } from '@angular/core';
import { GlobalService } from '../global.service'; 
import { HttpRequestService } from '../http-request.service';
import { GenericVm } from '../../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { LibraryVM } from '../../models/VM/basicData/LibraryVM';

@Injectable({
    providedIn: 'root'
  })
export class LibraryService{
  userToken: string;
  constructor(private http: HttpClient, public globals: GlobalService, public httpReq: HttpRequestService, public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  //Method to handle calling the Get API responsible for getting a Library by id
  getLibraryById(LibraryId: number){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Library/GetLibraryById/'+LibraryId).toPromise().then(
      result => {
        let Library = (result as GenericVm<LibraryVM>).data;
        this.globals.messages = (result as GenericVm<LibraryVM>).messages;
        
        return Library;
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

  //Method to handle calling the Post API responsible for creating a new Library
  createNewLibrary(Library: LibraryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Library/CreateNewLibrary', Library).toPromise().then()
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
  
  //Method to handle calling the Post API responsible for updating an existing Library
  updateLibrary(library: LibraryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthRequest('Library/UpdateLibrary', library).toPromise().then()
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

  //Method to handle calling the Get API responsible for getting the list view of the user saved Libraries
  getLibrariesList(){
    this.globals.Spinner = true;
    return this.httpReq.GetAuthRequest('Library/GetAllLibraries/').toPromise().then(
      result => {
        let LibrariesList = (result as GenericVm<Array<LibraryVM>>).data;
        this.globals.messages = (result as GenericVm<Array<LibraryVM>>).messages;
        
        return LibrariesList;
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
  
  //Method to handle calling the Post API responsible for deleting an existing Library
  deleteLibrary(library: LibraryVM){
    this.globals.Spinner = true;
    return this.httpReq.postAuthFile('Library/DeleteLibrary', library).toPromise().then()
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