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
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { ResearchRequestReplyVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestReplyVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-research-retreat-follow',
  templateUrl: './research-retreat-follow.component.html',
  styleUrls: ['./research-retreat-follow.component.scss']
})
export class ResearchRetreatFollowComponent implements OnInit {
  currentRate = 4;

  userId;
  researchRequestId;
  library: LibraryVM;
  requestTypesList: CommonVM[];
  gradesList: CommonVM[];
  requestType: CommonVM;
  room: RoomVM;
  grade: CommonVM;
  researchRequest: ResearchRequestVM = new ResearchRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  requestStatusesList: CommonVM[];
  requestComment: string;
  repliesList: ResearchRequestReplyVM[];
  serviceRating: ServiceRatingVM;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig ,
    public router: Router,
    public CommonService: CommonService,
    public ResearchRequestService: ResearchRequestService,
    public serviceRatingService: ServiceRatingService,
    public LibraryService: LibraryService,
    public RoomService: RoomService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { 
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.researchRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestStatusesList();
      this.getRequestTypes();
      this.getGrades();
      this.getResearchRequestById(this.researchRequestId, this.userId);
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

  getRequestTypes(){
    this.ResearchRequestService.getResearchRequestTypes().then((res) => {
      const result = res as Array<CommonVM>;

      this.requestTypesList = result;
    });
  }
  
  getGrades(){
    this.ResearchRequestService.getGrades().then((res) => {
      const result = res as Array<CommonVM>;

      this.gradesList = result;
    });
  }

  getResearchRequestById(researchRequestId: number, userId: string) {
    this.spinner.show();
    this.ResearchRequestService.getResearchRequestById(researchRequestId, userId).then((res) => {
      const result = res as ResearchRequestVM;

      this.researchRequest = result;
      this.getRequestType();
      this.getLibrary();
      if(this.researchRequest.roomId)
        this.getRoom();
      this.getGrade();
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
    });
  }

  getRequestReplies(){
    this.ResearchRequestService.getAllResearchRequestReplies(this.researchRequestId).then((res) => {
      let result = res as Array<ResearchRequestReplyVM>;

      this.repliesList = result;
    });
  }
  
  isMyReply(reply: ResearchRequestReplyVM){
    if(reply.createdBy == this.userId){
      return true;
    }
    else{
      return false;
    }
  }

  getRequestType(){
    this.requestType = this.requestTypesList.find(request => request.id == this.researchRequest.requestTypeId);
  }
  
  getLibrary() {
    this.LibraryService.getLibraryById(this.researchRequest.libraryId).then((res) => {
      const result = res as LibraryVM;

      this.library = result;
    });
  }
  
  getRoom() {
    this.RoomService.getRoomById(this.researchRequest.roomId).then((res) => {
      const result = res as RoomVM;
      
      this.room = result;
    });
  }
  
  getGrade(){
    this.grade = this.gradesList.find(request => request.id == this.researchRequest.responsibleGradeId);
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new ResearchRequestReplyVM();
        requestReply.researchRequestId = this.researchRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.researchRequest.responsibleName;
        requestReply.userMessage = this.requestComment;
        
        this.spinner.show();
        this.global.Messages = [];
        this.ResearchRequestService.createNewResearchRequestReply(requestReply).then()
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
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 5).then((res) => {
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
        this.serviceRating.serviceType = 5;
        this.serviceRating.requestId = this.researchRequest.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }
}