import { Injectable, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service'; 
import { HttpRequestService } from './http-request.service';
import { GenericVm } from '../models/system/generic-vm';
import { TranslateService } from '@ngx-translate/core';
import { Message } from '../models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { HttpClient } from '@angular/common/http';
import { VisitAvailableDateVM } from '../models/VM/basicData/VisitAvailableDateVM';
import { ResearchAvailableDateVM } from '../models/VM/basicData/ResearchAvailableDateVM';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  userToken: string;
  caller: any;
  confirmAction: (model: any) => Promise<void | object>;

  constructor(private http: HttpClient,
     private globals: GlobalService,
     private httpReq: HttpRequestService,
     public translate: TranslateService) {
    this.userToken = globals.getCurrentUserToken();
  }

  generateSelectedVisitAvailableDates(selectedVisitAvailableDatesList: Array<VisitAvailableDateVM>, selectedDate: string) {
    this.caller.generateSelectedAvailableDates(selectedVisitAvailableDatesList, selectedDate);
  }

  generateSelectedResearchAvailableDate(selectedDate: string) {
    this.caller.generateSelectedAvailableDate(selectedDate);
  }
}
