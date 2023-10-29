import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { AddRetreatAppointmentComponent } from '../add-retreat-appointment/add-retreat-appointment.component';
import { RoomAvailableDayVM } from 'src/app/shared/models/VM/basicData/RoomAvailableDayVM';
import { ResearchAvailableDateVM } from 'src/app/shared/models/VM/basicData/ResearchAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ResearchDatesGeneratorVM } from 'src/app/shared/models/VM/ResearchDatesGeneratorVM';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-research-retreat-generate',
  templateUrl: './research-retreat-generate.component.html',
  styleUrls: ['./research-retreat-generate.component.scss']
})
export class ResearchRetreatGenerateComponent implements OnInit {

  userId;
  model: NgbDateStruct;
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  page = 1;
  librariesList: Array<LibraryVM>;
  roomsList: Array<RoomVM>;
  libraryId: number;
  roomId: number;
  listToView: Array<ResearchAvailableDateVM> = new Array<ResearchAvailableDateVM>();
  researchPeriodsList: Array<CommonVM> = new Array<CommonVM>();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  minDatePicker: { year: number; month: number; day: number; };
  requestStatusesList: CommonVM[];

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    public router: Router,
    public CommonService: CommonService,
    public ResearchRequestService: ResearchRequestService,
    public LibraryService: LibraryService,
    public RoomService: RoomService,
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

  getRoomsList() {
    this.RoomService.getRoomsByLibraryId(this.libraryId).then((res) => {
      const result = res as Array<RoomVM>;

      this.roomsList = result;
    });
  }

  getRoomResearchAvailableDays() {
    this.listToView = [];
    if(!this.startDatePicker)
      this.startDate = null;
    if(!this.endDatePicker)
      this.endDate = null;
    this.spinner.show();
    this.ResearchRequestService.getAllRoomResearchDatesByRoomId(this.roomId, this.startDate, this.endDate).then((res) => {
      const result = res as Array<ResearchAvailableDateVM>;

      this.listToView = result;
      this.spinner.hide();
      $('#researchDaysTable').DataTable().destroy();
      setTimeout(() => {
        $('#researchDaysTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          lengthMenu: [5, 10, 25, 100],
          order: [[1, "desc"]]
        });
      }, 1);
    });
  }

  getDayOfWeek(date: string){
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var arDays = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

    let fullDate = new Date(date);
    return this.translate.currentLang == 'en' ? days[fullDate.getDay()] : arDays[fullDate.getDay()];
  }

  setStartDate(date: NgbDate) {
    this.startDate = date.year + '-' + date.month + '-' + date.day;
    this.minDatePicker = date;
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year + '-' + date.month + '-' + date.day;
  }

  generateSelectedAvailableDate(selectedDate: string) {
    if (selectedDate) {
      let generatedDatesVM = new ResearchDatesGeneratorVM();
      generatedDatesVM.userId = this.userId;
      generatedDatesVM.selectedDate = selectedDate;
      this.spinner.show();
      this.global.Messages = [];
      this.ResearchRequestService.generateNewResearchAvailableDate(generatedDatesVM).then()
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
    if (this.roomId && this.startDate && this.endDate) {
      let roomDays = new Array<RoomAvailableDayVM>();
      this.ResearchRequestService.getRoomAvailableDaysByRoomId(this.roomId).then((res) => {
        const result = res as Array<RoomAvailableDayVM>;

        roomDays = result;
        if (roomDays.length > 0) {
          let generatedDatesVM = new ResearchDatesGeneratorVM();
          generatedDatesVM.userId = this.userId;
          generatedDatesVM.startDate = this.startDate;
          generatedDatesVM.endDate = this.endDate;
          generatedDatesVM.daysToGenerate = roomDays;
          this.spinner.show();
          this.global.Messages = [];
          this.ResearchRequestService.generateNewResearchAvailableDatesRange(generatedDatesVM).then()
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
          this.confirmationModalService.message = this.translate.currentLang == 'en' ? "There is no any scheduled days for this room, please determine a schedule first"
                                                                                     : "لا توجد أي مواعيد محددة لهذه القاعة ، من فضلك حدد بعض المواعيد أولاً";
          this.confirmationModalService.caller = this;
        }
      });
    }
  }

  resetView() {
    this.listToView = [];
    this.roomId = null;
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

  deleteConfirmation(researchDate: ResearchAvailableDateVM) {
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = researchDate;
    this.confirmationModalService.confirmAction = this.ResearchRequestService.deleteResearchAvailableDate;
    this.confirmationModalService.caller = this;
  }

  addGeneratedTime() {
    this.openAppointmentPicker();
    this.appointmentService.caller = this;
  }

  openAppointmentPicker() {
    const modalRef = this.modalService.open(AddRetreatAppointmentComponent, { centered: true, size: 'md' });
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
