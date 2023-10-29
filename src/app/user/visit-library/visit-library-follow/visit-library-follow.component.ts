import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { VisitRequestVM } from 'src/app/shared/models/VM/businessServices/VisitRequestVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { VisitRequestReplyVM } from 'src/app/shared/models/VM/businessServices/VisitRequestReplyVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { AuthorityTypesEnum, RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-visit-library-follow',
  templateUrl: './visit-library-follow.component.html',
  styleUrls: ['./visit-library-follow.component.scss']
})
export class VisitLibraryFollowComponent implements OnInit {
  currentRate = 4;
  userId;
  visitRequestId;
  library: LibraryVM;
  visitRequest: VisitRequestVM = new VisitRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  requestStatusesList: CommonVM[];
  repliesList: VisitRequestReplyVM[];

  oldSelectedPeriod: PeriodVM;
  requestComment: string;
  serviceRating: ServiceRatingVM;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  public get AuthorityTypesEnum(): typeof AuthorityTypesEnum {
    return AuthorityTypesEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig ,
    public router: Router,
    public CommonService: CommonService,
    public VisitRequestService: VisitRequestService,
    public serviceRatingService: ServiceRatingService,
    public LibraryService: LibraryService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { 
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.visitRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestStatusesList();
      this.getVisitRequestById(this.visitRequestId, this.userId);
    }
  }
  
  getRequestStatusesList(){
    this.CommonService.GetCommonsByDomain("RequestStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }

  getRequestStatusById(requestStatusId: number){
    let status = this.requestStatusesList.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
  }

  getVisitRequestById(visitRequestId: number, userId: string){
    this.spinner.show();
    this.VisitRequestService.getVisitRequestById(visitRequestId, userId).then((res) => {
      const result = res as VisitRequestVM;
      this.visitRequest = result;
      
      this.getOldSelectedPeriod();
      this.getLibrary();
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
    });
  }

  getOldSelectedPeriod(){
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      this.oldSelectedPeriod = result.find(p => p.id == this.visitRequest.visitAvailableDate.periodId);
    });
  }

  getRequestReplies(){
    this.VisitRequestService.getAllVisitRequestReplies(this.visitRequestId).then((res) => {
      let result = res as Array<VisitRequestReplyVM>;

      this.repliesList = result;
    });
  }

  isMyReply(reply: VisitRequestReplyVM){
    if(reply.createdBy == this.userId){
      return true;
    }
    else{
      return false;
    }
  }

  getLibrary(){
    this.LibraryService.getLibraryById(this.visitRequest.libraryId).then((res) => {
    const result = res as LibraryVM;
  
    this.library = result;
    });
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new VisitRequestReplyVM();
        requestReply.visitRequestId = this.visitRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.visitRequest.responsibleName;
        requestReply.userMessage = this.requestComment;
        
        this.spinner.show();
        this.global.Messages = [];
        this.VisitRequestService.createNewVisitRequestReply(requestReply).then()
        .finally(() => {
          if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
            f.resetForm();
            this.getRequestReplies();
            this.spinner.hide();
          }     
        });
      }
    }
  }
  
  getServiceRatingByUserId() {
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 4).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if(!result){
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }
  
  createOrUpdateServiceRating(){
    if(this.serviceRating.rate > 0){
      if(this.serviceRating.id){
        this.serviceRating.updatedBy = this.userId;
      }
      else{
        this.serviceRating.serviceType = 4;
        this.serviceRating.requestId = this.visitRequest.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }
}