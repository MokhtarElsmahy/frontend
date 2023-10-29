import { Injectable, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GlobalService } from './global.service'; 
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PrintService {
  
  private modelSource = new BehaviorSubject(null);
  currentModel = this.modelSource.asObservable();
  
  constructor(private http: HttpClient,
     public globals: GlobalService,
     public translate: TranslateService) {
  }

  setModelToPrint(modelToPrint: any){
    this.modelSource.next(modelToPrint);
  }

  getModelToPrint(){
      return this.modelSource.getValue();
  }

  print(){
    if(this.modelSource){
      setTimeout(p => {
          window.print();
      }, 0);  
    }
  }
}
