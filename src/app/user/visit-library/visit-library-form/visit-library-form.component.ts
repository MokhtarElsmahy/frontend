import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { LibraryAvailableDayVM } from 'src/app/shared/models/VM/basicData/LibraryAvailableDayVM';
import { VisitAvailableDateVM } from 'src/app/shared/models/VM/basicData/VisitAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { VisitRequestVM } from 'src/app/shared/models/VM/businessServices/VisitRequestVM';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { VisitRequestReplyVM } from 'src/app/shared/models/VM/businessServices/VisitRequestReplyVM';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorityTypesEnum, RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-visit-library-form',
  templateUrl: './visit-library-form.component.html',
  styleUrls: ['./visit-library-form.component.scss']
})
export class VisitLibraryFormComponent implements OnInit {

  userId;
  isEditMode: boolean;
  visitRequestId;
  librariesList: Array<LibraryVM>;
  selectedDate;
  oldSelectedPeriod: PeriodVM;
  visitAvailableDatesList: Array<VisitAvailableDateVM> = new Array<VisitAvailableDateVM>();
  visitAvailableDatesPeriodsList: Array<any> = new Array<any>();
  listToView: Array<VisitAvailableDateVM> = new Array<VisitAvailableDateVM>();
  visitRequest: VisitRequestVM = new VisitRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  startDatePicker: NgbDateStruct;
  minDatePicker: { year: number; month: number; day: number; };
  enabledDates:NgbDateStruct[]=[];

  model = {
    per_sat: true ,
    per_sat2: true,

  };

  public get AuthorityTypesEnum(): typeof AuthorityTypesEnum {
    return AuthorityTypesEnum; 
  }

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig ,
    private calendar: NgbCalendar,
    public router: Router,
    public VisitRequestService: VisitRequestService,
    public LibraryService: LibraryService,
    public CommonService: CommonService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { 
    alertConfig.type = 'success';
    const current = new Date();
    this.minDatePicker = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.visitRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getVisitRequestById(this.visitRequestId, this.userId);
    }
    this.autoFillUserInfo();
    this.getLibrariesList();
  }

  autoFillUserInfo(){
    if(!this.visitRequest.responsibleName){
      this.visitRequest.responsibleName = this.global.getUserFromLocalStorage().fullName;
    }

    if(!this.visitRequest.responsibleEmail){
      this.visitRequest.responsibleEmail = this.global.getUserFromLocalStorage().email;
    }

    if(!this.visitRequest.responsibleMobile){
      this.visitRequest.responsibleMobile = this.global.getUserFromLocalStorage().phoneNumber;
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

  getLibrariesList(){
    this.LibraryService.getLibrariesList().then((res) => {
    const result = res as Array<LibraryVM>;
  
    this.librariesList = result;
    });
  }
  
  getVisitRequestById(visitRequestId: number, userId: string){
    this.spinner.show();
    this.VisitRequestService.getVisitRequestById(visitRequestId, userId).then((res) => {
      let result = res as VisitRequestVM;

      this.visitRequest = result;
      this.getVisitAvailableDatesByLibraryId();
      this.getOldSelectedPeriod();
      this.spinner.hide();
    });
  }
  
  getOldSelectedPeriod(){
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      this.oldSelectedPeriod = result.find(p => p.id == this.visitRequest.visitAvailableDate.periodId);
    });
  }
  
  setSelectedDate(date: NgbDate){
    this.resetPeriods();
    this.selectedDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.getVisitAvailablePeriods();
  }


  getVisitAvailableDatesByLibraryId(){
    this.resetPeriods();
    this.visitAvailableDatesPeriodsList = [];
    this.VisitRequestService.getVisitAvailableDatesByLibraryId(this.visitRequest.libraryId).then((res) => {
      const result = res as Array<VisitAvailableDateVM>;

      this.visitAvailableDatesList = result;

      this.disableDays();
    });
  }

  disableDays() {
    this.isDisabled = (date: NgbDateStruct) => {
      const calenderDate = new Date(date.year, date.month - 1, date.day);

      var disabled = true;
      for (let index = 0; index < this.visitAvailableDatesList.length; index++) {

        var currentTime = new Date(this.visitAvailableDatesList[index].date);
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var workDate = month + "/" + day + "/" + year;

        var calMonth = calenderDate.getMonth() + 1;
        var calDay = calenderDate.getDate();
        var calYear = calenderDate.getFullYear();
        var currentCalenderDate = calMonth + "/" + calDay + "/" + calYear;

        if (workDate === currentCalenderDate) {
          disabled = false;
          break;
        }
      }
      return disabled;
    }
  }

  isDisabled = (date: NgbDateStruct) => {
    return this.enabledDates.find(x => new NgbDate(x.year, x.month, x.day).equals(date)) ?
      false : true;
  }

  getVisitAvailablePeriods(){
    this.visitAvailableDatesPeriodsList = new Array<any>();
    this.VisitRequestService.getVisitAvailablePeriodsByDate(this.selectedDate, this.visitRequest.libraryId).then((res) => {
      const result = res as Array<PeriodVM>;

      result.map(x=> {
        this.visitAvailableDatesPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
      });
    });
  }

  togglePeriodsSelection(periodsList: Array<any>, periodId: number, f: NgForm){
    let periodElement = periodsList.find(p => p.id == periodId);

    if(periodElement.isSelected){
      periodElement.isSelected = false;
    }else{
      periodsList.forEach(p => p.isSelected = false);
      periodElement.isSelected = true;

      this.visitRequest.visitDateId = this.visitAvailableDatesList.find(d => d.date.split('T')[0] == this.selectedDate && d.periodId == periodId).id;
      f.form.markAsDirty();
    }
  }

  resetPeriods(){
    this.visitAvailableDatesPeriodsList.forEach(p => p.isSelected = false);
  }
  
  confirmSubmission(f: NgForm){
    if(f.valid && this.visitRequest?.visitDateId){
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
      if(!this.visitRequest?.visitDateId){
        this.openModal();
        this.confirmationModalService.modalType = 'message';
        this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please determine a visit date and period first"
                                                                                   : "من فضلك حدد تاريخ و موعد الزيارة أولاً";
        this.confirmationModalService.caller = this;
      }
    }
  }
  
  submitForm() {
    if (this.isEditMode) {
      this.visitRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.VisitRequestService.updateVisitRequest(this.visitRequest).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          this.confirmationModalService.response = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/user/visit-library-view");
          }, 2000);
        }     
      });
    }
    else{
      this.visitRequest.userId = this.userId;
      this.visitRequest.createdBy = this.userId;
      this.visitRequest.requestStatusId = RequestStatusEnum.Pending; //Pending by default
      this.spinner.show();
      this.global.Messages = [];
      this.VisitRequestService.createNewVisitRequest(this.visitRequest).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/user/visit-library-view");
          }, 2000);
        }     
      });
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
