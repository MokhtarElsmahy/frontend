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
import { CopyRequestService } from 'src/app/shared/services/businessServices/copy-request.service';
import { CopyRequestVM } from 'src/app/shared/models/VM/businessServices/CopyRequestVM';

@Component({
  selector: 'app-copy-book-follow',
  templateUrl: './copy-book-follow.component.html',
  styleUrls: ['./copy-book-follow.component.scss']
})
export class CopyBookFollowComponent implements OnInit {

  fileToUpload: any

  userId: string
  staticAlertClosed = true;

  CopyRequestVM: CopyRequestVM = new CopyRequestVM();

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

    public CopyRequestService: CopyRequestService) { }
  ngOnInit(): void {
    this.CopyRequestVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.CopyRequestVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
    this.CopyRequestVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {

      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getManuscriptRequestById(this.RequestId, this.userId);
      this.getAllRequestComment(this.RequestId)
      this.getRequestStatusesList();
      this.getServiceRatingByUserId();
    }
  }


  getManuscriptRequestById(giftRequestId: number, userId: string) {
    this.CopyRequestService.getCopyRequestById(giftRequestId, userId).then((res) => {

      const result = res as CopyRequestVM;
      this.CopyRequestVM = result
     
    });
  }
  getAllRequestComment(RequestId: number) {
    this.spinner.show()
    this.CopyRequestService.getAllRequestComment(RequestId).then(
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
      this.CommentVm.RequestId = this.CopyRequestVM.id
      this.CommentVm.userName = this.global.getUserFromLocalStorage().fullName;
      this.CommentVm.createdDate = new Date();
      this.CopyRequestService.createNewComment(this.CommentVm).then().finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.getAllRequestComment(this.CopyRequestVM.id)
          this.spinner.hide();
          this.CommentVm = new GiftBackCommentVM();

        }
      });
    }
  }

  isMyReply(reply: GiftBackCommentVM) {
    if (reply.createdBy != this.CopyRequestVM.createdBy) {
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
    return this.CopyRequestService.Download(this.CopyRequestVM.id,this.CopyRequestVM.createdBy)
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
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 10).then((res) => {
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
        this.serviceRating.serviceType = 10;
        this.serviceRating.requestId = this.CopyRequestVM.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }

}
