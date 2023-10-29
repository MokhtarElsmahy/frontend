import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SubscribeFormComponent } from '../subscribe-form/subscribe-form.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';

import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';


import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribeRequestService } from 'src/app/shared/services/businessServices/subscribe-request.service';
import { MainClassificationVM, SelectiveBroadcastItemVm, SelectiveBroadcastVm, SubClassificationVM } from 'src/app/shared/models/VM/businessServices/SelectiveBroadcastVm';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.scss']
})
export class SubscribeListComponent implements OnInit {
  userId
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  constructor(public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService,
    public SubscribeService: SubscribeRequestService,
    private modalService: NgbModal,

  ) { }
  ngOnInit(): void {
  this.userId = this.global.getCurrentUserId();
    this.getRequest(this.userId);
  }

  // constructor(
  //   public translate: TranslateService,
  //   private modalService: NgbModal,
  //   ) 
  //   { }
  subscribe() {
    const modalRef = this.modalService.open(SubscribeFormComponent, { centered: true, size: 'md' });
  }


  getRequest(userId: string) {
    this.spinner.show();
    this.SubscribeService.getSubscribtion(userId).then((res) => {
      // const result = res as SelectiveBroadcastVm;
      // this.SelectiveBroadcastVm = result

    


      this.spinner.hide();
    });
  }
  indexToArchive: number = 0;
  AssignArchiveVars(index: number) {

    this.indexToArchive = index;
  }
  archiveConfirmation(index: number) {
    this.AssignArchiveVars(index)
    this.openModal();
    this.confirmationModalService.modalType = 'delete2';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure ? you won't recieve any notifications regarding your favourite books"
      : "لن يصلك اى اشعارات فى حالة توفر كتبك المفضلة . هل أنت متأكد .؟")

    this.confirmationModalService.caller = this;



  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }

  submitForm2() {
    this.SubscribeService.SelectiveBroadcastVm.selectivebroadcastItems.splice(this.indexToArchive, 1);
  }

  confirmSubmission() {

    this.openModal();
    this.confirmationModalService.modalType = 'confirmation';
    this.confirmationModalService.message = this.SubscribeService.SelectiveBroadcastVm.id <= 0 ? (this.translate.currentLang == 'en' ? "Are you sure, you want to confirm the request ?"
      : "هل أنت متأكد ، تريد تأكيد الطلب ؟")
      : (this.translate.currentLang == 'en' ? "Are you sure, you want to save the changes ?"
        : "هل أنت متأكد ، تريد حفظ التعديلات ؟");
    this.confirmationModalService.caller = this;

  }
  submitForm() {
    this.spinner.show();

    if (this.SubscribeService.SelectiveBroadcastVm.id > 0) {
      this.SubscribeService.SelectiveBroadcastVm.updatedBy = this.global.getCurrentUserId();
      this.SubscribeService.SelectiveBroadcastVm.updatedDate = new Date();
      this.SubscribeService.updateRequest(this.SubscribeService.SelectiveBroadcastVm).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            this.getRequest(this.userId);
          }
        });
    }else{
      this.SubscribeService.SelectiveBroadcastVm.beneficiaryEmail = this.global.getUserFromLocalStorage().email
      this.SubscribeService.SelectiveBroadcastVm.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
      this.SubscribeService.SelectiveBroadcastVm.beneficiaryName = this.global.getUserFromLocalStorage().fullName
      this.SubscribeService.SelectiveBroadcastVm.requestStatusId = RequestStatusEnum.Pending
      this.SubscribeService.SelectiveBroadcastVm.createdBy = this.global.getCurrentUserId();
      this.SubscribeService.SelectiveBroadcastVm.createdDate = new Date();
      this.SubscribeService.createNewRequest(this.SubscribeService.SelectiveBroadcastVm).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          this.confirmationModalService.response = false;
          this.getRequest(this.userId);
        }
      });
    }

  }
}
