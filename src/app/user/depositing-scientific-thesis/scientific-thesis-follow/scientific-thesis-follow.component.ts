import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ThesisDepositionRequestService } from 'src/app/shared/services/businessServices/thesisDepositionRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { ThesisDepositionRequestVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestVM';
import { environment } from 'src/environments/environment';
import { ThesisDepositionRequestReplyVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestReplyVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-scientific-thesis-follow',
  templateUrl: './scientific-thesis-follow.component.html',
  styleUrls: ['./scientific-thesis-follow.component.scss']
})
export class ScientificThesisFollowComponent implements OnInit {
  currentRate = 4;
  userId;
  baseUrl;
  thesisDepositionRequestId;
  thesisDepositionRequest: ThesisDepositionRequestVM = new ThesisDepositionRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  requestStatusesList: CommonVM[];
  requestComment: string;
  repliesList: ThesisDepositionRequestReplyVM[];
  serviceRating: ServiceRatingVM;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig ,
    private calendar: NgbCalendar,
    public router: Router,
    public CommonService: CommonService,
    public ThesisDepositionRequestService: ThesisDepositionRequestService,
    public serviceRatingService: ServiceRatingService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { 
    this.baseUrl = environment.api_url;
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.thesisDepositionRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestStatusesList();
      this.getThesisDepositionRequestById(this.thesisDepositionRequestId, this.userId);
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

    return this.translate.currentLang == 'en' ? status?.value : status?.valueArabic;
  }

  getThesisDepositionRequestById(thesisDepositionRequestId: number, userId: string) {
    this.spinner.show();
    this.ThesisDepositionRequestService.getThesisDepositionRequestById(thesisDepositionRequestId, userId).then((res) => {
      const result = res as ThesisDepositionRequestVM;

      this.thesisDepositionRequest = result;
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
      // console.log(this.thesisDepositionRequest);
    });
  }
  
  getRequestReplies(){
    this.ThesisDepositionRequestService.getAllThesisDepositionRequestReplies(this.thesisDepositionRequestId).then((res) => {
      let result = res as Array<ThesisDepositionRequestReplyVM>;

      this.repliesList = result;
    });
  }

  isMyReply(reply: ThesisDepositionRequestReplyVM){
    if(reply.createdBy == this.userId){
      return true;
    }
    else{
      return false;
    }
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new ThesisDepositionRequestReplyVM();
        requestReply.thesisDepositionRequestId = this.thesisDepositionRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.thesisDepositionRequest.applicantName;
        requestReply.userMessage = this.requestComment;
        
        this.spinner.show();
        this.global.Messages = [];
        this.ThesisDepositionRequestService.createNewThesisDepositionRequestReply(requestReply).then()
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
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 6).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;
      if(!result){
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }
  
  createOrUpdateServiceRating(){
    if(this.serviceRating?.rate > 0){
      if(this.serviceRating?.id){
        this.serviceRating.updatedBy = this.userId;
      }
      else{
        this.serviceRating.serviceType = 6;
        this.serviceRating.requestId = this.thesisDepositionRequest.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }
}