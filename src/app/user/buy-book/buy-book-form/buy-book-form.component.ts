import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-buy-book-form',
  templateUrl: './buy-book-form.component.html',
  styleUrls: ['./buy-book-form.component.scss'],
})
export class BuyBookFormComponent implements OnInit {
  currentRate = 4;

  userId: string;
  isEditMode: boolean;
  suggestion = new SuggestionVM();
  suggestionId;
  BookTypesList: CommonVM[];
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.suggestionId = this.activeRoute.snapshot.paramMap.get('id');
      this.getSuggestionById(this.suggestionId, this.userId);
    }
    this.autoFillUserInfo();
    this.getBookTypes();
  }

  autoFillUserInfo() {
    if (!this.suggestion.visitorName) {
      this.suggestion.visitorName = this.global.getUserFromLocalStorage().fullName;
    }

    if (!this.suggestion.visitorEmail) {
      this.suggestion.visitorEmail = this.global.getUserFromLocalStorage().email;
    }

    if (!this.suggestion.visitorMobile) {
      this.suggestion.visitorMobile = this.global.getUserFromLocalStorage().phoneNumber;
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
  
  getSuggestionById(suggestionId: number, userId: string) {
    this.suggestionService.getSuggestionById(suggestionId, userId).then((res) => {
      this.suggestion = res as SuggestionVM;
    });
  }

  getBookTypes() {
    this.commonService.GetCommonsByDomain('BookType').then((res) => {
      const result = res as Array<CommonVM>;

      this.BookTypesList = result;
    });
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
    if (this.isEditMode) {
      this.suggestion.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.suggestionService.updateSuggestion(this.suggestion).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/buy-book-view");
            }, 2000);
          }
        });
    }
    else {
      this.suggestion.isArchived = false;
      this.suggestion.createdBy = !this.userId || this.userId == '0' ? 'Anonymous' : this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.suggestionService.createNewSuggestion(this.suggestion).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/buy-book-view");
            }, 2000);
          }
        });
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
