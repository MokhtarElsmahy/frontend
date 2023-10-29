import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { LibraryAvailableDayVM } from 'src/app/shared/models/VM/basicData/LibraryAvailableDayVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-visit-library-schedule',
  templateUrl: './visit-library-schedule.component.html',
  styleUrls: ['./visit-library-schedule.component.scss']
})
export class VisitLibraryScheduleComponent implements OnInit {

  weekModel = {
    sat: false,
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    tha: false,
    fri: false,
    per_sat: false,
    per_sat2: false,
    per_sun: false,
    per_sun2: false,
    per_mon: false,
    per_mon2: false,
    per_tue: false,
    per_tue2: false,
    per_wed: false,
    per_wed2: false,
    per_tha: false,
    per_tha2: false,
    per_fri: false,
    per_fri2: false,

  };

  userId;
  libraryId: number;
  librariesList: Array<LibraryVM>;
  periodsList: Array<any> = new Array<any>();
  SaturdayPeriodsList: Array<any> = new Array<any>();
  SundayPeriodsList: Array<any> = new Array<any>();
  MondayPeriodsList: Array<any> = new Array<any>();
  TuesdayPeriodsList: Array<any> = new Array<any>();
  WednesdayPeriodsList: Array<any> = new Array<any>();
  ThursdayPeriodsList: Array<any> = new Array<any>();
  FridayPeriodsList: Array<any> = new Array<any>();
  visitPeriodsList: Array<PeriodVM> = new Array<PeriodVM>();
  selectedLibrariesDays: Array<LibraryAvailableDayVM> = new Array<LibraryAvailableDayVM>();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    public router: Router,
    public VisitRequestService: VisitRequestService,
    public LibraryService: LibraryService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getLibrariesList();
    this.getAllPeriods();
  }

  displayLibraryAvailableDaysAndPeriods() {
    this.VisitRequestService.getLibraryAvailableDaysByLibraryId(this.libraryId).then((res) => {
      const result = res as Array<LibraryAvailableDayVM>;

      this.resetWeekView();
      result.forEach(r => {
        switch (r.dayOfTheWeek) {
          case "Saturday":
            this.weekModel.sat = true;
            this.SaturdayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Saturday").isSelected = true;
            break;
          case "Sunday":
            this.weekModel.sun = true;
            this.SundayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Sunday").isSelected = true;
            break;
          case "Monday":
            this.weekModel.mon = true;
            this.MondayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Monday").isSelected = true;
            break;
          case "Tuesday":
            this.weekModel.tue = true;
            this.TuesdayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Tuesday").isSelected = true;
            break;
          case "Wednesday":
            this.weekModel.wed = true;
            this.WednesdayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Wednesday").isSelected = true;
            break;
          case "Thursday":
            this.weekModel.tha = true;
            this.ThursdayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Thursday").isSelected = true;
            break;
          case "Friday":
            this.weekModel.fri = true;
            this.FridayPeriodsList.find(p => p.id == r.periodId && r.dayOfTheWeek == "Friday").isSelected = true;
            break;
        }
      });
    });
  }

  resetWeekView() {
    this.weekModel.sat = false;
    this.weekModel.sun = false;
    this.weekModel.mon = false;
    this.weekModel.tue = false;
    this.weekModel.wed = false;
    this.weekModel.tha = false;
    this.weekModel.fri = false;
    this.SaturdayPeriodsList.forEach(d => d.isSelected = false);
    this.SundayPeriodsList.forEach(d => d.isSelected = false);
    this.MondayPeriodsList.forEach(d => d.isSelected = false);
    this.TuesdayPeriodsList.forEach(d => d.isSelected = false);
    this.WednesdayPeriodsList.forEach(d => d.isSelected = false);
    this.ThursdayPeriodsList.forEach(d => d.isSelected = false);
    this.FridayPeriodsList.forEach(d => d.isSelected = false);
    this.selectedLibrariesDays = [];
  }

  getLibrariesList() {
    this.LibraryService.getLibrariesList().then((res) => {
      const result = res as Array<LibraryVM>;

      this.librariesList = result;
    });
  }

  getAllPeriods() {
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      result.map(x => {
        this.periodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.SaturdayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.SundayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.MondayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.TuesdayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.WednesdayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.ThursdayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
        this.FridayPeriodsList.push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false});
      });;
    });
  }

  getPeriodText(periodId: number) {
    let period = this.visitPeriodsList.find(p => p.id == periodId);
    return period.periodFrom +' '+ (this.translate.currentLang == 'en' ? period.periodOfTheDayFrom : period.periodOfTheDayToAr) +' - '+ period.periodTo +' '+ (this.translate.currentLang == 'en' ? period.periodOfTheDayTo : period.periodOfTheDayToAr);
  }

  setSelectedDay(dayOfWeek, isSelected){
    if(!isSelected){
      switch (dayOfWeek) {
        case "Saturday":
          this.SaturdayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Sunday":
          this.SundayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Monday":
          this.MondayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Tuesday":
          this.TuesdayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Wednesday":
          this.WednesdayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Thursday":
          this.ThursdayPeriodsList.forEach(p => p.isSelected = false);
          break;
        case "Friday":
          this.FridayPeriodsList.forEach(p => p.isSelected = false);
          break;
      }
    }
  }

  setSelectedPeriod(dayOfWeek: string, periodId: number) {
    switch (dayOfWeek) {
      case "Saturday":
        this.togglePeriodsSelection(this.SaturdayPeriodsList, periodId);
        break;
      case "Sunday":
        this.togglePeriodsSelection(this.SundayPeriodsList, periodId);
        break;
      case "Monday":
        this.togglePeriodsSelection(this.MondayPeriodsList, periodId);
        break;
      case "Tuesday":
        this.togglePeriodsSelection(this.TuesdayPeriodsList, periodId);
        break;
      case "Wednesday":
        this.togglePeriodsSelection(this.WednesdayPeriodsList, periodId);
        break;
      case "Thursday":
        this.togglePeriodsSelection(this.ThursdayPeriodsList, periodId);
        break;
      case "Friday":
        this.togglePeriodsSelection(this.FridayPeriodsList, periodId);
        break;
    }
  }

  togglePeriodsSelection(periodsList: Array<any>, periodId: number) {
    let periodElement = periodsList.find(p => p.id == periodId);

    if (periodElement.isSelected) {
      periodElement.isSelected = false;
    } else {
      periodElement.isSelected = true;
    }
  }

  collectSelectionsFromView() {
    this.SaturdayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Saturday", p.id);
    });
    this.SundayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Sunday", p.id);
    });
    this.MondayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Monday", p.id);
    });
    this.TuesdayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Tuesday", p.id);
    });
    this.WednesdayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Wednesday", p.id);
    });
    this.ThursdayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Thursday", p.id);
    });
    this.FridayPeriodsList.forEach(p => {
      if (p.isSelected)
        this.addToUpdateList("Friday", p.id);
    });
  }

  addToUpdateList(dayOfTheWeek: string, periodId: number) {
    let selectedLibraryDay = new LibraryAvailableDayVM();
    selectedLibraryDay.libraryId = this.libraryId;
    selectedLibraryDay.dayOfTheWeek = dayOfTheWeek;
    selectedLibraryDay.periodId = periodId;
    selectedLibraryDay.createdBy = this.userId;
    this.selectedLibrariesDays.push(selectedLibraryDay);
  }

  updateLibraryAvailableDays() {
    this.collectSelectionsFromView();
    if (this.selectedLibrariesDays.length && this.libraryId && this.userId) {
      this.spinner.show();
      this.global.Messages = [];
      this.VisitRequestService.updateLibraryAvailableDays(this.selectedLibrariesDays).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
          }, 2000);
        }
      });
      this.libraryId = null;
      this.resetWeekView();
    }
  }
}
