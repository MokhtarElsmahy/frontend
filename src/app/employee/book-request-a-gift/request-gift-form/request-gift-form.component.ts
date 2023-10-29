import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpRequestService } from 'src/app/shared/services/http-request.service';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiftBackRequestVM } from 'src/app/shared/models/VM/businessServices/GiftBackRequestVM';
import { GiftBackBookVM } from 'src/app/shared/models/VM/businessServices/GiftBackBookVM';
import { GiftBookRequestService } from 'src/app/shared/services/businessServices/gift-book-request.service';
import { GiftBackSearchVm } from 'src/app/shared/models/VM/businessServices/GiftBackSearchVm';
import { GiftedBookVM } from 'src/app/shared/models/VM/businessServices/GiftedBookVM';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { GiftBackCommentVM } from 'src/app/shared/models/VM/businessServices/GiftBackCommentVM';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';

@Component({
  selector: 'app-request-gift-form',
  templateUrl: './request-gift-form.component.html',
  styleUrls: ['./request-gift-form.component.scss']
})


export class RequestGiftFormComponent implements OnInit {
  decesion = true;
  userId: string
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  GiftBackRequestVM: GiftBackRequestVM = new GiftBackRequestVM()
  ListToView: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  ListOfComment: Array<GiftBackCommentVM> = new Array<GiftBackCommentVM>()
  CommentVm: GiftBackCommentVM = new GiftBackCommentVM();
  RequestId: any
  requestComment: string;
  serviceRating: ServiceRatingVM = new ServiceRatingVM();
  requestStatusesList: CommonVM[];
  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
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
    public GiftBookRequest: GiftBookRequestService


  ) { }

  ngOnInit(): void {

    this.userId = this.global.getCurrentUserId();
    this.getRequestStatusesList();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestById(this.RequestId, this.userId);
      this.getAllRequestComment(this.RequestId)


    } else {
      this.ListToView = new Array<GiftBackBookVM>()
    }
  }

  isCheckedsubmit = false;
  checkuncheckall() {
    if (this.isCheckedsubmit == true) {
      //this.isChecked = false;
      this.ListToView.forEach(elem => {
        elem.isChecked = false
      })

      this.isCheckedsubmit = false;
    }
    else {

      this.ListToView.forEach(elem => {
        elem.isChecked = true
      })

      this.isCheckedsubmit = true;
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
  getRequestById(RequestId: number, userId: string) {
    this.spinner.show()
    this.GiftBookRequest.getRequestById(RequestId, userId).then(
      (res) => {

        const result = res as GiftBackRequestVM
        //console.log(result)
        this.GiftBackRequestVM.id = result.id
        this.GiftBackRequestVM.giftBackBooks = this.ListToView = result.giftBackBooks
        this.GiftBackRequestVM.userId = this.global.getCurrentUserId();
        this.GiftBackRequestVM.beneficiaryEmail = result.beneficiaryEmail
        this.GiftBackRequestVM.beneficiaryName = result.beneficiaryName
        this.GiftBackRequestVM.beneficiaryMobile = result.beneficiaryMobile
        this.GiftBackRequestVM.reason = result.reason
        this.GiftBackRequestVM.requestStatusId = result.requestStatusId;
        this.GiftBackRequestVM.createdBy = result.createdBy;
        this.GiftBackRequestVM.createdDate = result.createdDate;
        this.decesion = result.requestStatusId == RequestStatusEnum.Pending ||result.requestStatusId == RequestStatusEnum.Rejected ? false : true;
        this.getServiceRatingByUserId()
        this.spinner.hide();
      }
    )
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });

  }

  Validate(decision: boolean): boolean {
    if ((!this.GiftBackRequestVM.reason || this.GiftBackRequestVM.reason.trim().length == 0) && decision == false) {
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "You must enter a rejection reason"
        : "يجب ادخال سبب الرفض")

      return true;
    }
    return false
  }
  submitForm() {

    let Validate = this.Validate(this.decesion);
    if (Validate)
      return
    this.GiftBackRequestVM.updatedBy = this.userId;
    this.GiftBackRequestVM.requestStatusId = this.decesion == true ? RequestStatusEnum.Approved : RequestStatusEnum.Rejected
    this.spinner.show();
    this.global.Messages = [];
    this.GiftBookRequest.updateRequest(this.GiftBackRequestVM).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/giftSpecialLibraries/request-gift-view");
          }, 2000);
        }
      });


  }



  getAllRequestComment(RequestId: number) {
    this.spinner.show()
    this.GiftBookRequest.getAllRequestComment(RequestId).then(
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
      this.CommentVm.RequestId = this.GiftBackRequestVM.id
      this.CommentVm.userName = this.global.getUserFromLocalStorage().fullName;
      this.CommentVm.createdDate = new Date();
      this.GiftBookRequest.createNewComment(this.CommentVm).then().finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.getAllRequestComment(this.GiftBackRequestVM.id)
          this.spinner.hide();
          this.CommentVm = new GiftBackCommentVM();

        }
      });
    }
  }

  getServiceRatingByUserId() {
    this.serviceRatingService.getServiceRatingByUserId(this.GiftBackRequestVM.createdBy, 8).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if (!result) {
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }

  createOrUpdateServiceRating() {
    if (this.serviceRating.rate > 0) {
      if (this.serviceRating.id) {
        this.serviceRating.updatedBy = this.userId;
      }
      else {
        this.serviceRating.serviceType = 8;
        this.serviceRating.requestId = this.GiftBackRequestVM.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
        .finally(() => {

        });
    }
  }

  isMyReply(reply: GiftBackCommentVM) {
    if (reply.createdBy != this.GiftBackRequestVM.createdBy) {
      return true;
    }
    else {
      return false;
    }
  }

}
