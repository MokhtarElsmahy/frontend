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
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { ResearchRequestReplyVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestReplyVM';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { RequestStatusEnum, ResearchRequestTypesEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-research-retreat-form',
  templateUrl: './research-retreat-form.component.html',
  styleUrls: ['./research-retreat-form.component.scss']
})
export class ResearchRetreatFormComponent implements OnInit {

  userId;
  researchRequestId;
  library: LibraryVM;
  room: RoomVM;
  requestType: CommonVM;
  grade: CommonVM;
  requestTypesList: Array<CommonVM>;
  gradesList: Array<CommonVM>;
  researchRequest: ResearchRequestVM = new ResearchRequestVM();
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
  repliesList: ResearchRequestReplyVM[];
  requestComment: string;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  public get ResearchRequestTypesEnum(): typeof ResearchRequestTypesEnum {
    return ResearchRequestTypesEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    private calendar: NgbCalendar,
    public router: Router,
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
      this.getRequestTypes();
      this.getGrades();
      this.getResearchRequestById(this.researchRequestId, this.userId);
    }
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
    this.grade = this.gradesList?.find(request => request.id == this.researchRequest.responsibleGradeId);
  }


  setRequestStatus(requestStatusId: number) {
    this.researchRequest.requestStatusId = requestStatusId;
    if (requestStatusId == this.RequestStatusEnum.Approved) { // Approved
      this.researchRequest.reasonOfRejection = null;
    }
    else if (requestStatusId == this.RequestStatusEnum.Rejected) { // Rejected
      this.researchRequest.instructions = null;
    }
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new ResearchRequestReplyVM();
        requestReply.researchRequestId = this.researchRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.global.getUserFromLocalStorage().fullName;
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
    this.serviceRatingService.getServiceRatingByUserId(this.researchRequest.createdBy, 5).then((res) => {
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
      this.researchRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.ResearchRequestService.updateResearchRequest(this.researchRequest).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            f.resetForm();
            this.router.navigateByUrl("/auth/publicAdminstration/research-retreat-view");
          }, 2000);
        }     
      });
    }
    else {
      f.form.markAllAsTouched();
    }
  }
}