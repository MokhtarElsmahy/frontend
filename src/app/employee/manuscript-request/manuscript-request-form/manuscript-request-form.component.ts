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
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-manuscript-request-form',
  templateUrl: './manuscript-request-form.component.html',
  styleUrls: ['./manuscript-request-form.component.scss']
})
export class ManuscriptRequestFormComponent implements OnInit {

  decesion = true;
  isDone: boolean = false;
  fileToUpload: any

  userId: string
  staticAlertClosed = true;

  ManuscriptVM: ManuscriptVM = new ManuscriptVM();

  RequestId;
  RequestStatus: number

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

      this.isDone = this.ManuscriptVM.requestStatusId == RequestStatusEnum.Pending ? false : true
    }
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

    public manuscriptService: ManuscriptRequestService) { }


  getManuscriptRequestById(giftRequestId: number, userId: string) {
    this.manuscriptService.getManuscriptRequestById(giftRequestId, userId).then((res) => {

      const result = res as ManuscriptVM;
      this.ManuscriptVM = result
      this.ManuscriptVM.isTermsApprove = true;
      // console.log(this.ManuscriptVM)
      this.isDone = result.requestStatusId == RequestStatusEnum.Pending ? false : true
      this.getServiceRatingByUserId();

    });
  }
  handleFileInput(e: any) {
    this.spinner.show();
    this.fileToUpload = e?.target?.files[0];

    let formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.manuscriptService.Upload(formData).then(
      (res) => {
        let path = (res as GenericVm<string>).data
        this.ManuscriptVM.filePath = path;
      }
    ).finally(() => {
      this.spinner.hide();
    })

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


  setRequestStatus(requestStatusId: number) {
    this.ManuscriptVM.requestStatusId = requestStatusId;
    if (requestStatusId == this.RequestStatusEnum.Approved) { // Approved
      this.ManuscriptVM.reasonOfRejection = null;
    }
    else if (requestStatusId == this.RequestStatusEnum.Rejected) { // Rejected
      this.ManuscriptVM.instructions = null;
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });

  }
  submitForm(f: NgForm) {
    if (f.valid) {

      if (this.ManuscriptVM.requestStatusId == RequestStatusEnum.Approved && !this.ManuscriptVM.filePath) {
        let ValidationMsg = "";
        if (this.translate.currentLang == 'en')
          ValidationMsg += '<div>' + `you must choose the file to upload` + '</div>'
        else {
          ValidationMsg += '<div>' + `يجب اختيار ملف المخطوطه المراد ارساله` + '</div>'
        }
        this.openModal();
        this.confirmationModalService.modalType = 'message2';
        this.confirmationModalService.message = ValidationMsg;

        // console.log(ValidationMsg)
        return;
      }

      this.ManuscriptVM.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.manuscriptService.updateManuscriptRequest(this.ManuscriptVM).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              f.resetForm();
              this.router.navigateByUrl("/auth/printingArchiving/manuscript-request-view");
            }, 2000);
          }
        });
    }
    else {
      f.form.markAllAsTouched();
    }
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
  getServiceRatingByUserId() {

    this.serviceRatingService.getServiceRatingByUserId(this.ManuscriptVM.createdBy, 9).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if (!result) {
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }

  ForceDecide(): boolean {
    if (this.ManuscriptVM.requestStatusId == RequestStatusEnum.Pending) {
      return true
    }
    return false
  }
}
