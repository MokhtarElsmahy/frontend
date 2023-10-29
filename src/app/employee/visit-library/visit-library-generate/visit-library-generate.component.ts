import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { LibraryAvailableDayVM } from 'src/app/shared/models/VM/basicData/LibraryAvailableDayVM';
import { VisitAvailableDateVM } from 'src/app/shared/models/VM/basicData/VisitAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { VisitDatesGeneratorVM } from 'src/app/shared/models/VM/VisitDatesGeneratorVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-visit-library-generate',
  templateUrl: './visit-library-generate.component.html',
  styleUrls: ['./visit-library-generate.component.scss']
})
export class VisitLibraryGenerateComponent implements OnInit {

  userId;
  model: NgbDateStruct;
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  page = 1;
  requestStatusesList: Array<CommonVM>;
  librariesList: Array<LibraryVM>;
  libraryId: number;
  listToView: Array<VisitAvailableDateVM> = new Array<VisitAvailableDateVM>();
  visitPeriodsList: Array<PeriodVM> = new Array<PeriodVM>();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  minDatePicker: { year: number; month: number; day: number; };

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    public router: Router,
    public CommonService: CommonService,
    public VisitRequestService: VisitRequestService,
    public LibraryService: LibraryService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) {
      this.initializeMinDate();
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getRequestStatusesList();
    this.getLibrariesList();
    this.getAllVisitPeriods();
  }

  getRequestStatusesList(){
    this.CommonService.GetCommonsByDomain("DateStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }

  getRequestStatusById(requestStatusId: number){
    let status = this.requestStatusesList.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
  }

  getLibrariesList() {
    this.LibraryService.getLibrariesList().then((res) => {
      const result = res as Array<LibraryVM>;

      this.librariesList = result;
    });
  }

  getLibraryVisitAvailableDays() {
    this.listToView = [];
    if(!this.startDatePicker)
      this.startDate = null;
    if(!this.endDatePicker)
      this.endDate = null;
    this.spinner.show();
    this.VisitRequestService.getAllLibraryVisitDatesByLibraryId(this.libraryId, this.startDate, this.endDate).then((res) => {
      const result = res as Array<VisitAvailableDateVM>;

      this.listToView = result;
      this.spinner.hide();
      $('#visitDaysTable').DataTable().destroy();
      setTimeout(() => {
        $('#visitDaysTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          lengthMenu: [5, 10, 25, 100],
          order: [[1, "desc"]]
        });
      }, 1);
    });
  }

  getAllVisitPeriods() {
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      this.visitPeriodsList = result;
    });
  }

  getDayOfWeek(date: string){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var arDays = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

    let fullDate = new Date(date);
    return this.translate.currentLang == 'en' ? days[fullDate.getDay()] : arDays[fullDate.getDay()];
  }

  getPeriodText(periodId: number) {
    let period = this.visitPeriodsList.find(p => p.id == periodId);
    return period.periodFrom +' '+ (this.translate.currentLang == 'en' ? period.periodOfTheDayFrom : period.periodOfTheDayToAr) +' - '+ period.periodTo +' '+ (this.translate.currentLang == 'en' ? period.periodOfTheDayTo : period.periodOfTheDayToAr);
  }

  setStartDate(date: NgbDate) {
    this.startDate = date.year + '-' + date.month + '-' + date.day;
    this.minDatePicker = date;
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year + '-' + date.month + '-' + date.day;
  }

  generateSelectedAvailableDates(selectedDatesToGenerate: Array<VisitAvailableDateVM>, selectedDate: string) {
    if (selectedDatesToGenerate && selectedDate) {
      let generatedDatesVM = new VisitDatesGeneratorVM();
      generatedDatesVM.userId = this.userId;
      generatedDatesVM.selectedDate = selectedDate;
      generatedDatesVM.selectedDatesToGenerate = selectedDatesToGenerate;
      generatedDatesVM.selectedDatesToGenerate.forEach(d => d.libraryId = this.libraryId);
      this.spinner.show();
      this.global.Messages = [];
      this.VisitRequestService.generateNewVisitAvailableDate(generatedDatesVM).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.resetView();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
          }, 2000);
        }
      });
    }
  }

  generateAvailableDatesRange() {
    if (this.libraryId && this.startDate && this.endDate) {
      let libraryDays = new Array<LibraryAvailableDayVM>();
      this.VisitRequestService.getLibraryAvailableDaysByLibraryId(this.libraryId).then((res) => {
        const result = res as Array<LibraryAvailableDayVM>;

        libraryDays = result;
        if (libraryDays.length > 0) {
          let generatedDatesVM = new VisitDatesGeneratorVM();
          generatedDatesVM.userId = this.userId;
          generatedDatesVM.startDate = this.startDate;
          generatedDatesVM.endDate = this.endDate;
          generatedDatesVM.daysToGenerate = libraryDays;
          this.spinner.show();
          this.global.Messages = [];
          this.VisitRequestService.generateNewVisitAvailableDatesRange(generatedDatesVM).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.resetView();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
              }, 2000);
            }
          });
        }else{
          this.openModal();
          this.confirmationModalService.modalType = 'message';
          this.confirmationModalService.message = this.translate.currentLang == 'en' ? "There is no any scheduled days for this library, please determine a schedule first"
                                                                                     : "لا توجد أي مواعيد محددة لهذه المكتبة ، من فضلك حدد بعض المواعيد أولاً";
          this.confirmationModalService.caller = this;
        }
      });
    }
  }

  resetView() {
    this.listToView = [];
    this.libraryId = null;
    this.startDate = null;
    this.startDatePicker = null;
    this.endDate = null;
    this.endDatePicker = null;
    this.initializeMinDate();
  }

  initializeMinDate(){
    const current = new Date();
    this.minDatePicker = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  deleteConfirmation(visitDate: VisitAvailableDateVM) {
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = visitDate;
    this.confirmationModalService.confirmAction = this.VisitRequestService.deleteVisitAvailableDate;
    this.confirmationModalService.caller = this;
  }

  addGeneratedTime() {
    this.openAppointmentPicker();
    this.appointmentService.caller = this;
  }

  openAppointmentPicker() {
    const modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'md' });
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
