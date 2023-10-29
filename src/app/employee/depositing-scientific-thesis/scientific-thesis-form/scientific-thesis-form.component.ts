import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ThesisDepositionRequestService } from 'src/app/shared/services/businessServices/thesisDepositionRequest.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ThesisDepositionRequestVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestVM';
import Stepper from 'bs-stepper'
import { UniversityVM } from 'src/app/shared/models/VM/basicData/UniversityVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { environment } from 'src/environments/environment';
import { ThesisDepositionRequestReplyVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestReplyVM';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-scientific-thesis-form',
  templateUrl: './scientific-thesis-form.component.html',
  styleUrls: ['./scientific-thesis-form.component.scss']
})
export class ScientificThesisFormComponent implements OnInit {
  
  userId;
  baseUrl;
  thesisDepositionRequestId;
  thesisDepositionRequest: ThesisDepositionRequestVM = new ThesisDepositionRequestVM();
  universitiesList: Array<UniversityVM> = new Array<UniversityVM>();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  serviceRating: ServiceRatingVM;
    
  private stepper: Stepper;
  repliesList: ThesisDepositionRequestReplyVM[];
  requestComment: string;
  progress: number;
  message: string;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    public router: Router,
    public ThesisDepositionRequestService: ThesisDepositionRequestService,
    public serviceRatingService: ServiceRatingService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService,
    private http: HttpClient) {
      this.baseUrl = environment.api_url;
      alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.thesisDepositionRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getThesisDepositionRequestById(this.thesisDepositionRequestId, this.userId);
    }
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true
    })
  }

  next() {
    this.stepper.next();
  }
  previous(){
    this.stepper.previous();

  }
  
  onSubmit() {
    return false;
  }

  getThesisDepositionRequestById(thesisDepositionRequestId: number, userId: string) {
    this.spinner.show();
    this.ThesisDepositionRequestService.getThesisDepositionRequestById(thesisDepositionRequestId, userId).then((res) => {
      const result = res as ThesisDepositionRequestVM;

      this.thesisDepositionRequest = result;
      this.getAllUniversities();
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
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

  setRequestStatus(requestStatusId: number) {
    this.thesisDepositionRequest.requestStatusId = requestStatusId;
    if (requestStatusId == this.RequestStatusEnum.Approved) { // Approved
      this.thesisDepositionRequest.reasonOfRejection = null;
    }
    else if (requestStatusId == this.RequestStatusEnum.Rejected) { // Rejected
      this.thesisDepositionRequest.instructions = null;
    }
  }

  getAllUniversities(){
    this.ThesisDepositionRequestService.getAllUniversities().then((res) => {
      let result = res as Array<UniversityVM>;

      this.universitiesList = result;
    });
  }

  getUniversityById(universityId: number){
    let university = this.universitiesList.find(u => u.id == universityId);

    return this.translate.currentLang == 'en' ? university.nameEn : university.nameAr;
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new ThesisDepositionRequestReplyVM();
        requestReply.thesisDepositionRequestId = this.thesisDepositionRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.global.getUserFromLocalStorage().fullName;
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
    this.serviceRatingService.getServiceRatingByUserId(this.thesisDepositionRequest.createdBy, 6).then((res) => {
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
      this.thesisDepositionRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.ThesisDepositionRequestService.updateThesisDepositionRequest(this.thesisDepositionRequest).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            f.resetForm();
            this.router.navigateByUrl("/auth/universityThesises/scientific-thesis-view");
          }, 2000);
        }     
      });
    }
    else {
      f.form.markAllAsTouched();
    }
  }
}