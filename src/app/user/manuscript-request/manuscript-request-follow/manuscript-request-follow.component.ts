import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';

import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { GiftBackCommentVM } from 'src/app/shared/models/VM/businessServices/GiftBackCommentVM';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { ManuscriptRequestService } from 'src/app/shared/services/businessServices/manuscript-request.service';
import { ManuscriptVM } from 'src/app/shared/models/VM/businessServices/ManuscriptVM';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-manuscript-request-follow',
  templateUrl: './manuscript-request-follow.component.html',
  styleUrls: ['./manuscript-request-follow.component.scss']
})
export class ManuscriptRequestFollowComponent implements OnInit  {

  constructor(public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService,
    public serviceRatingService: ServiceRatingService,

    public manuscriptService: ManuscriptRequestService) { }
  decesion = true;
  isDone : boolean =false;
  fileToUpload: any

  userId: string
  staticAlertClosed = true;

  ManuscriptVM: ManuscriptVM = new ManuscriptVM();

  RequestId;
  RequestStatus : number

  ListOfComment: Array<GiftBackCommentVM> = new Array<GiftBackCommentVM>()
  CommentVm: GiftBackCommentVM = new GiftBackCommentVM();


  serviceRating: ServiceRatingVM = new ServiceRatingVM();
  requestStatusesList: CommonVM[];

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  ngOnInit(): void {
    this.ManuscriptVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.ManuscriptVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
    this.ManuscriptVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {

      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getManuscriptRequestById(this.RequestId, this.userId);
      this.getAllRequestComment(this.RequestId)
      this.getRequestStatusesList();
      this.getServiceRatingByUserId();
      this.isDone = this.ManuscriptVM.requestStatusId == RequestStatusEnum.Pending ? false : true
    }
  }



  getManuscriptRequestById(giftRequestId: number, userId: string) {
    this.manuscriptService.getManuscriptRequestById(giftRequestId, userId).then((res) => {

      const result = res as ManuscriptVM;
      this.ManuscriptVM = result
      this.ManuscriptVM.isTermsApprove = true;
      this.isDone = result.requestStatusId == RequestStatusEnum.Pending ? false : true
     
    });
  }
  getAllRequestComment(RequestId: number) {
    this.spinner.show()
    this.manuscriptService.getAllRequestComment(RequestId).then(
      (res) => {

        const result = res as Array<GiftBackCommentVM>
        this.ListOfComment = result;
        this.spinner.hide();
      }
    )
  }

  AddComment() {
    if (!this.CommentVm.comment) {
      return;
    } else {
      this.spinner.show()
      this.CommentVm.RequestId = this.ManuscriptVM.id
      this.CommentVm.userName = this.global.getUserFromLocalStorage().fullName;
      this.CommentVm.createdDate = new Date();
      this.manuscriptService.createNewComment(this.CommentVm).then().finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.getAllRequestComment(this.ManuscriptVM.id)
          this.spinner.hide();
          this.CommentVm = new GiftBackCommentVM();

        }
      });
    }
  }

  isMyReply(reply: GiftBackCommentVM) {
    if (reply.createdBy != this.ManuscriptVM.createdBy) {
      return true;
    }
    else {
      return false;
    }
  }

  getRequestStatusesList() {
    this.commonService.GetCommonsByDomain("RequestStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }

  getRequestStatusById(requestStatusId: number) {
    let status = this.requestStatusesList.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
  }


  downloadFile()
  {
    return this.manuscriptService.Download(this.ManuscriptVM.id,this.ManuscriptVM.createdBy)
    .then((result: Blob) => {
      const blob = new Blob([result],{type:'APPLICATION/pdf'}); // you can change the type
      console.log(blob);
      const url= window.URL.createObjectURL(blob);
      window.open(url);
      console.log("Success");
  });
  }

  getServiceRatingByUserId() {
    this.userId = this.global.getCurrentUserId();
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 9).then((res) => {
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
        this.serviceRating.serviceType = 9;
        this.serviceRating.requestId = this.ManuscriptVM.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }

}
