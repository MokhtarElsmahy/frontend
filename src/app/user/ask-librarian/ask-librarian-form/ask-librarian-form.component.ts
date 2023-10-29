import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service'; 
import { HttpRequestService } from 'src/app/shared/services/http-request.service';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { InquiryVM } from 'src/app/shared/models/VM/businessServices/InquiryVM';
import { InquiryService } from 'src/app/shared/services/businessServices/inquiry.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbAlert, NgbAlertConfig, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { InquiryTypesEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-ask-librarian-form',
  templateUrl: './ask-librarian-form.component.html',
  styleUrls: ['./ask-librarian-form.component.scss']
})
export class AskLibrarianFormComponent implements OnInit {
  
  userId: string;
  isEditMode: boolean;
  inquiry = new InquiryVM();
  inquiryId;
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;
  serviceRating: ServiceRatingVM;

  public get InquiryTypesEnum(): typeof InquiryTypesEnum {
    return InquiryTypesEnum; 
  }

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public inquiryService: InquiryService,
    public serviceRatingService: ServiceRatingService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
      alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.inquiryId = this.activeRoute.snapshot.paramMap.get('id');
      this.getInquiryById(this.inquiryId, this.userId);
    }
    this.autoFillUserInfo();
  }
  
  autoFillUserInfo(){
    if(!this.inquiry.visitorName){
      this.inquiry.visitorName = this.global.getUserFromLocalStorage().fullName;
    }

    if(!this.inquiry.visitorEmail){
      this.inquiry.visitorEmail = this.global.getUserFromLocalStorage().email;
    }

    if(!this.inquiry.visitorMobile){
      this.inquiry.visitorMobile = this.global.getUserFromLocalStorage().phoneNumber;
    }
  }
  
  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  
  getInquiryById(inquiryId: number, userId: string){
    this.inquiryService.getInquiryById(inquiryId, userId).then((res) => {
      let result = res as InquiryVM;
      this.inquiry = result;

      this.getServiceRatingByUserId();
    });
  }

  getServiceRatingByUserId() {
    this.serviceRatingService.getServiceRatingByUserId(this.userId, this.inquiry.type).then((res) => {
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
        this.serviceRating.serviceType = this.inquiry.type;
        this.serviceRating.requestId = this.inquiry.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        
      });
    }
  }

  confirmSubmission(f: NgForm){
    if(f.valid){
      this.openModal();
      this.confirmationModalService.modalType = 'confirmation';
      this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure, you want to confirm the request ?"
                                                                                                     : "هل أنت متأكد ، تريد تأكيد الطلب ؟") 
                                                               : (this.translate.currentLang == 'en' ? "Are you sure, you want to save the changes ?"
                                                                                                     : "هل أنت متأكد ، تريد حفظ التعديلات ؟");
      this.confirmationModalService.caller = this;
    }
    else{
      f.form.markAllAsTouched();
    }
  }

  submitForm() {
    if (this.isEditMode) {
      this.inquiry.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.inquiryService.updateInquiry(this.inquiry).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.spinner.hide();
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/ask-librarian-view");
            }, 2000);
          }
        });
    }
    else {
      this.inquiry.createdBy = !this.userId || this.userId == '0' ? 'Anonymous' : this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.inquiryService.createNewInquiry(this.inquiry).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            setTimeout(() => {
              this.spinner.hide();
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/ask-librarian-view");
            }, 2000);
          }
        });
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
