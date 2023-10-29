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
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { environment } from 'src/environments/environment';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum, ThesisAvailabilityTypesEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-scientific-thesis-form',
  templateUrl: './scientific-thesis-form.component.html',
  styleUrls: ['./scientific-thesis-form.component.scss']
})
export class ScientificThesisFormComponent implements OnInit {

  userId;
  baseUrl;
  isEditMode: boolean = false;
  thesisDepositionRequestId;
  thesisDepositionRequest: ThesisDepositionRequestVM = new ThesisDepositionRequestVM();
  universitiesList: Array<UniversityVM> = new Array<UniversityVM>();
  staticAlertClosed = true;
  thesisData: FormData;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  private stepper;
  readTermsAndConditions: boolean = false;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  public get ThesisAvailabilityTypesEnum(): typeof ThesisAvailabilityTypesEnum {
    return ThesisAvailabilityTypesEnum; 
  }

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    public router: Router,
    public ThesisDepositionRequestService: ThesisDepositionRequestService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) {
    this.baseUrl = environment.api_url;
    alertConfig.type = 'success';
  }


  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.thesisData = new FormData();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.thesisDepositionRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getThesisDepositionRequestById(this.thesisDepositionRequestId, this.userId);
    }
    this.autoFillUserInfo();
    this.getAllUniversities();
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: true,
      animation: true
    })
  }

  autoFillUserInfo() {
    if (!this.thesisDepositionRequest.applicantName) {
      this.thesisDepositionRequest.applicantName = this.global.getUserFromLocalStorage().fullName;
    }

    if (!this.thesisDepositionRequest.email) {
      this.thesisDepositionRequest.email = this.global.getUserFromLocalStorage().email;
    }

    if (!this.thesisDepositionRequest.mobile) {
      this.thesisDepositionRequest.mobile = this.global.getUserFromLocalStorage().phoneNumber;
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
  
  next(currentForm?: NgForm) {
    if (this.stepper._currentIndex == 0 && !this.readTermsAndConditions) {
      this.conditionsAlert();
    } else {
      if (currentForm && !currentForm.valid && !(this.isEditMode && this.thesisDepositionRequest.requestStatusId != this.RequestStatusEnum.Pending)) {
        currentForm.form.markAllAsTouched();
      } else {
        this.stepper.next();
      }
    }
  }
  previous() {
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
      this.readTermsAndConditions = true;
      this.spinner.hide();
    });
  }

  setAvailability(isAvailable: boolean) {
    if (isAvailable) {
      this.thesisDepositionRequest.isAvailable = true;
      this.thesisDepositionRequest.isAvailableWithChains = false;
      this.thesisDepositionRequest.availabilityType = 0;
    } else {
      this.thesisDepositionRequest.isAvailable = false;
      this.thesisDepositionRequest.isAvailableWithChains = true;
      this.thesisDepositionRequest.availabilityType = 0;
    }
  }

  setAvailabilityType(availabilityType: number) {
    this.thesisDepositionRequest.availabilityType = availabilityType;
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

  getAllUniversities() {
    this.ThesisDepositionRequestService.getAllUniversities().then((res) => {
      let result = res as Array<UniversityVM>;

      this.universitiesList = result;
    });
  }

  getUniversityById(universityId: number) {
    let university = this.universitiesList.find(u => u.id == universityId);

    return this.translate.currentLang == 'en' ? university.nameEn : university.nameAr;
  }

  conditionsAlert() {
    this.openModal();
    this.confirmationModalService.modalType = 'message';
    this.confirmationModalService.message = this.translate.currentLang == 'en' ? "You have to agree on the terms and conditions first to continue"
      : "عليك أن توافق على الشروط والأحكام أولاً قبل المواصلة";
    this.confirmationModalService.caller = this;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }

  handleFileInput(files: FileList, fileType: string, form: NgForm) {
    if (files.item(0).size <= environment.FileSize && (files.item(0).type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') || files.item(0).type == 'application/msword' || files.item(0).type == 'application/pdf') {
      this.thesisData.delete(fileType);
      this.thesisData.append(fileType, files.item(0));
    }
    else{
      form.controls[fileType].setValue(null);
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "The file type should be pdf or word only"
        : "يجب أن يكون الملف بصيغة pdf أو word فقط";
    }
  }

  confirmSubmission(f: NgForm) {
    if (f.valid || this.isEditMode) {
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
      this.thesisDepositionRequest.updatedBy = this.userId;
    } else {
      this.thesisDepositionRequest.userId = this.userId;
      this.thesisDepositionRequest.createdBy = this.userId;
      this.thesisDepositionRequest.requestStatusId = RequestStatusEnum.Pending; //Pending by default
      this.thesisDepositionRequest.isOutsideKingdom = false;

    }
    
    //For file attachments
    this.thesisData.append('jsonString', JSON.stringify(this.thesisDepositionRequest));
    this.spinner.show();
    this.global.Messages = [];
    this.ThesisDepositionRequestService.createOrUpdateThesisDepositionRequestWithAttachments(this.thesisData).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          this.confirmationModalService.response = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/user/scientific-thesis-view");
          }, 2000);
        }
      });
  }
}