import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { ManuscriptVM } from 'src/app/shared/models/VM/businessServices/ManuscriptVM';
import { ManuscriptRequestService } from 'src/app/shared/services/businessServices/manuscript-request.service';

@Component({
  selector: 'app-manuscript-request-form',
  templateUrl: './manuscript-request-form.component.html',
  styleUrls: ['./manuscript-request-form.component.scss']
})
export class ManuscriptRequestFormComponent  implements OnInit {

  isEditMode = false
  ManuscriptVM : ManuscriptVM = new ManuscriptVM();
  staticAlertClosed = true;
  RequestId;
  userId: string;
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
    private manuscriptService : ManuscriptRequestService
    


  ) { }

  ngOnInit(): void {

    this.ManuscriptVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.ManuscriptVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
    this.ManuscriptVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getManuscriptRequestById(this.RequestId, this.userId);
      
    } 
  }


  getManuscriptRequestById(giftRequestId: number, userId: string) {
    this.manuscriptService.getManuscriptRequestById(giftRequestId, userId).then((res) => {
      this.ManuscriptVM = res as ManuscriptVM;
      // console.log( this.ManuscriptVM);
      this.ManuscriptVM.isTermsApprove=true;
    });
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
  confirmSubmission(f: NgForm) {
    if (f.valid) {
      this.openModal();
      this.confirmationModalService.modalType = 'confirmation';
      this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure, you want to confirm the request ?"
                                                                                                     : "هل أنت متأكد ، تريد تأكيد الطلب ؟")
                                                                                                     : (this.translate.currentLang == 'en' ? "Are you sure, you want to save the changes ?"
                                                                                                     : "هل أنت متأكد ، تريد حفظ التعديلات ؟");
      this.confirmationModalService.caller = this;
    }
    else {
      f.form.markAllAsTouched();
    }
  }

  submitForm() {

    this.spinner.show();
    if(this.isEditMode==true){
      this.ManuscriptVM.updatedDate = new Date();
      this.ManuscriptVM.updatedBy = this.userId
      this.manuscriptService.updateManuscriptRequest(this.ManuscriptVM).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          this.confirmationModalService.response = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/user/manuscript-request-view");
          }, 2000);
        }
      });

    }else{
      this.ManuscriptVM.createdBy = this.global.getCurrentUserId();
      this.ManuscriptVM.createdDate = new Date();
      this.ManuscriptVM.updatedDate = null;
      this.ManuscriptVM.isArchived=false;
      this.ManuscriptVM.requestStatusId = RequestStatusEnum.Pending
      this.manuscriptService.createNewManuscriptRequest(this.ManuscriptVM).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/manuscript-request-view");
            }, 2000);
          }
        });
    }

  }
}
