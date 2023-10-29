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
import { NgForm } from '@angular/forms';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { LibraryExchangeBookVM, LibraryExchangeRequestVM } from 'src/app/shared/models/VM/businessServices/LibraryExchangRequestVM';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { LibraryExchangeRequestService } from 'src/app/shared/services/businessServices/library-exchange-request.service';

@Component({
  selector: 'app-libraries-exchange-form',
  templateUrl: './libraries-exchange-form.component.html',
  styleUrls: ['./libraries-exchange-form.component.scss']
})
export class LibrariesExchangeFormComponent implements OnInit {
  decesion = true;
  isDone : boolean =false;
  fileToUpload: any

  userId: string
  staticAlertClosed = true;

  LibRequestVM: LibraryExchangeRequestVM = new LibraryExchangeRequestVM();
  ListToView :  Array<LibraryExchangeBookVM>
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

    public LibraryService: LibraryExchangeRequestService) { }
  ngOnInit(): void {

   
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {

      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestById(this.RequestId, this.userId);
      this.getAllRequestComment(this.RequestId)
      
    }
  }

  getRequestById(RequestId: number, userId: string) {
    this.spinner.show()
    this.LibraryService.getRequestById(RequestId, userId).then(
      (res) => {

        const result = res as LibraryExchangeRequestVM
        // console.log(result)
        this.LibRequestVM.id = result.id
        this.LibRequestVM.exchangeBooks = this.ListToView = result.exchangeBooks
        this.LibRequestVM.userId = this.global.getCurrentUserId();
        this.LibRequestVM.beneficiaryEmail = result.beneficiaryEmail
        this.LibRequestVM.beneficiaryName = result.beneficiaryName
        this.LibRequestVM.beneficiaryMobile = result.beneficiaryMobile
        this.LibRequestVM.reasonOfRejection = result.reasonOfRejection
        this.LibRequestVM.instructions = result.instructions
        this.LibRequestVM.requestStatusId= result.requestStatusId;
        this.LibRequestVM.createdBy= result.createdBy;
        this.LibRequestVM.createdDate= result.createdDate;
        this.isDone = result.requestStatusId == RequestStatusEnum.Pending ? false : true
        this.decesion = (result.requestStatusId == RequestStatusEnum.Pending)||(result.requestStatusId ==RequestStatusEnum.Rejected) ? false : true;
        this.getServiceRatingByUserId();
        this.spinner.hide();
      }
    )
  }

  getAllRequestComment(RequestId: number) {
    this.spinner.show()
    this.LibraryService.getAllRequestComment(RequestId).then(
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
      this.CommentVm.RequestId = this.LibRequestVM.id
      this.CommentVm.userName = this.global.getUserFromLocalStorage().fullName;
      this.CommentVm.createdDate = new Date();
      this.LibraryService.createNewComment(this.CommentVm).then().finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.getAllRequestComment(this.LibRequestVM.id)
          this.spinner.hide();
          this.CommentVm = new GiftBackCommentVM();

        }
      });
    }
  }

  isMyReply(reply: GiftBackCommentVM) {
    if (reply.createdBy != this.LibRequestVM.createdBy) {
      return true;
    }
    else {
      return false;
    }
  }
  getServiceRatingByUserId() {
  
    this.serviceRatingService.getServiceRatingByUserId(this.LibRequestVM.createdBy,11).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if (!result) {
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }

  ForceDecide(): boolean {
    if (this.LibRequestVM.requestStatusId == RequestStatusEnum.Pending) {
      return true
    }
    return false
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
    this.LibRequestVM.requestStatusId = requestStatusId;
    if (requestStatusId == this.RequestStatusEnum.Approved) { // Approved
      this.LibRequestVM.reasonOfRejection = null;
    }
    else if (requestStatusId == this.RequestStatusEnum.Rejected) { // Rejected
      this.LibRequestVM.instructions = null;
    }
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });

  }


  submitForm(f: NgForm) {
    if (f.valid) {

      this.LibRequestVM.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.LibraryService.updateRequest(this.LibRequestVM).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            f.resetForm();
            this.router.navigateByUrl("/auth/giftSpecialLibraries/libraries-exchange-view");
          }, 2000);
        }     
      });
    }
    else {
      f.form.markAllAsTouched();
    }
  }
}
