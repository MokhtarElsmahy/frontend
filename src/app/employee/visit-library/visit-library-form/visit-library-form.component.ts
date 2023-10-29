import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { VisitRequestVM } from 'src/app/shared/models/VM/businessServices/VisitRequestVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { VisitRequestReplyVM } from 'src/app/shared/models/VM/businessServices/VisitRequestReplyVM';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { AuthorityTypesEnum, RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-visit-library-form',
  templateUrl: './visit-library-form.component.html',
  styleUrls: ['./visit-library-form.component.scss']
})
export class VisitLibraryFormComponent implements OnInit {

  userId;
  visitRequestId;
  library: LibraryVM;
  visitPeriodsList: PeriodVM[];
  visitRequest: VisitRequestVM = new VisitRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  serviceRating: ServiceRatingVM;

  startDatePicker: NgbDateStruct;
  enabledDates: NgbDateStruct[] = [
    { year: 2022, month: 3, day: 18 }
  ];
  model = {
    per_sat: true,
    per_sat2: true,

  };
  requestStatusesList: CommonVM[];
  requestComment: string;
  repliesList: VisitRequestReplyVM[];

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  public get AuthorityTypesEnum(): typeof AuthorityTypesEnum {
    return AuthorityTypesEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    private calendar: NgbCalendar,
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
      this.getVisitRequestById(this.visitRequestId, this.userId);
      this.getAllVisitPeriods();
      this.getRequestStatusesList();
    }
  }

  getVisitRequestById(visitRequestId: number, userId: string) {
    this.spinner.show();
    this.VisitRequestService.getVisitRequestById(visitRequestId, userId).then((res) => {
      const result = res as VisitRequestVM;

      this.visitRequest = result;
      this.getLibrary();
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
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
  
  getLibrary() {
    this.LibraryService.getLibraryById(this.visitRequest.libraryId).then((res) => {
      const result = res as LibraryVM;

      this.library = result;
    });
  }

  getAllVisitPeriods() {
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      this.visitPeriodsList = result;
    });
  }

  getPeriodText(periodId: number) {
    let period = this.visitPeriodsList?.find(p => p.id == periodId);
    return period?.periodFrom +' '+ (this.translate.currentLang == 'en' ? period?.periodOfTheDayFrom : period?.periodOfTheDayToAr) +' - '+ period?.periodTo +' '+ (this.translate.currentLang == 'en' ? period?.periodOfTheDayTo : period?.periodOfTheDayToAr);
  }

  getRequestStatusesList(){
    this.CommonService.GetCommonsByDomain("RequestStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }
  
  getRequestStatusById(requestStatusId: number){
    let status = this.requestStatusesList?.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status?.value : status?.valueArabic;
  }

  setRequestStatus(requestStatusId: number) {
    this.visitRequest.requestStatusId = requestStatusId;
    if (requestStatusId == this.RequestStatusEnum.Approved) { // Approved
      this.visitRequest.reasonOfRejection = null;
    }
    else if (requestStatusId == this.RequestStatusEnum.Rejected) { // Rejected
      this.visitRequest.instructions = null;
    }
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new VisitRequestReplyVM();
        requestReply.visitRequestId = this.visitRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.global.getUserFromLocalStorage().fullName;
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
    this.serviceRatingService.getServiceRatingByUserId(this.visitRequest.createdBy, 4).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if(!result){
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }

  submitForm(f: NgForm) {
    if (f.valid) {
      this.visitRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.VisitRequestService.updateVisitRequest(this.visitRequest).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            f.resetForm();
            this.router.navigateByUrl("/auth/programsAndEvents/visit-library-view");
          }, 2000);
        }     
      });
    }
    else {
      f.form.markAllAsTouched();
    }
  }
}