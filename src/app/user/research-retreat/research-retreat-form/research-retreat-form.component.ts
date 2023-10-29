import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbCalendar, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { RoomAvailableDayVM } from 'src/app/shared/models/VM/basicData/RoomAvailableDayVM';
import { ResearchAvailableDateVM } from 'src/app/shared/models/VM/basicData/ResearchAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CallNumbers, ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum, ResearchRequestTypesEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-research-retreat-form',
  templateUrl: './research-retreat-form.component.html',
  styleUrls: ['./research-retreat-form.component.scss']
})
export class ResearchRetreatFormComponent implements OnInit {
  callNumbersForm: FormGroup;
  callIdForm: FormGroup;

  CallNumbers: CallNumbers[]
  previousNums: CallNumbers[]
  model: NgbDateStruct;
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  userId;
  isEditMode: boolean = false;
  researchRequestId;
  requestTypesList: Array<CommonVM>;
  gradesList: Array<CommonVM>;
  librariesList: Array<LibraryVM>;
  roomsList: Array<RoomVM>;
  selectedDate;
  researchAvailableDatesList: Array<ResearchAvailableDateVM> = new Array<ResearchAvailableDateVM>();
  researchAvailableDatesPeriodsList: Array<any> = new Array<any>();
  listToView: Array<ResearchAvailableDateVM> = new Array<ResearchAvailableDateVM>();
  researchRequest: ResearchRequestVM = new ResearchRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  minDatePicker: { year: number; month: number; day: number; };
  enabledDates: NgbDateStruct[] = [];
  researchOnlyTypeId: number;
  researchAndSubjectTypeId: number;
  validDates: boolean;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }

  public get ResearchRequestTypesEnum(): typeof ResearchRequestTypesEnum {
    return ResearchRequestTypesEnum;
  }

  constructor(calendar: NgbCalendar,
    private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    public router: Router,
    public ResearchRequestService: ResearchRequestService,
    public LibraryService: LibraryService,
    public RoomService: RoomService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService) {
    alertConfig.type = 'success';
    const current = new Date();
    this.minDatePicker = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.callNumbersForm = this.fb.group({
      callNumbers: this.fb.array([this.addcallNumbersGroup()])
    });


  }



  private addcallNumbersGroup(): FormGroup {
    return this.fb.group({
      callNum: [],
    });


  }

  //Add Fields
  addcallNumbers(): void {
    if (this.callNumbersForm.controls['callNumbers'].valid) {
      this.callNumbersArray.push(this.addcallNumbersGroup());
    }
    else
      this.callNumbersForm.controls['callNumbers'].markAllAsTouched();



  }

  //Remove Fields
  removecallNumbers(index: number): void {
    this.callNumbersArray.removeAt(index);

  }
  //Fields Array
  get callNumbersArray(): FormArray {
    return <FormArray>this.callNumbersForm.get('callNumbers');
  }

  viewg() {
    console.log(this.callNumbersArray.controls.map(c => c.value))
    this.CallNumbers = this.callNumbersArray.controls.map(c => c.value);
    this.researchRequest.callNum = this.CallNumbers.map(c => c.callNum).join(',')


    //this.researchRequest.callNum = this.researchRequest.CallNumbers.join(',')

    //  for (let index = 0; index < this.callNumbersArray.controls.values.length; index++) {
    //   const element = this.callNumbersArray.controls.values[index];
    //     this.researchRequest.callNum +=element.value
    //     console.log(element.value);
    //  }


    // console.log(this.CallNumbers);
    // console.log(this.researchRequest.callNum);
    // console.log(this.previousNums);

  }




  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getRequestTypes();
    this.getLibrariesList();
    this.getGrades();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.researchRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getResearchRequestById(this.researchRequestId, this.userId);
    }
    this.autoFillUserInfo();
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

  onDateSelection(date: NgbDate, f: NgForm) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      f.form.markAsDirty();
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  autoFillUserInfo() {
    if (!this.researchRequest.responsibleName) {
      this.researchRequest.responsibleName = this.global.getUserFromLocalStorage().fullName;
    }

    if (!this.researchRequest.responsibleMobile) {
      this.researchRequest.responsibleMobile = this.global.getUserFromLocalStorage().phoneNumber;
    }
  }

  getRequestTypes() {
    this.ResearchRequestService.getResearchRequestTypes().then((res) => {
      const result = res as Array<CommonVM>;

      this.requestTypesList = result;

      this.researchOnlyTypeId = this.requestTypesList.find(type => type.value == 'Research').id;
      this.researchAndSubjectTypeId = this.requestTypesList.find(type => type.value == 'Research with subject').id;
    });
  }

  getGrades() {
    this.ResearchRequestService.getGrades().then((res) => {
      const result = res as Array<CommonVM>;

      this.gradesList = result;
    });
  }

  getLibrariesList() {
    this.LibraryService.getLibrariesList().then((res) => {
      const result = res as Array<LibraryVM>;

      this.librariesList = result;
    });
  }

  getRoomsList() {
    this.roomsList = [];
    if (this.researchRequest.requestTypeId != ResearchRequestTypesEnum.Subject) { // Subject type
      this.RoomService.getRoomsByLibraryId(this.researchRequest.libraryId).then((res) => {
        const result = res as Array<RoomVM>;

        this.roomsList = result;
      });
    }
  }

  resetRoomChoice() {
    if (this.researchRequest.requestTypeId == ResearchRequestTypesEnum.Subject) { // Subject type
      this.researchRequest.roomId = null;
      this.roomsList = [];
    } else {
      this.getRoomsList();
    }
    this.fromDate = null;
    this.researchRequest.dateFrom = null;
    this.toDate = null;
    this.researchRequest.dateTo = null;
    this.isDisabled = (date: NgbDateStruct) => {
      return this.researchRequest?.requestTypeId == ResearchRequestTypesEnum.Subject ? false : true;
    }
  }


  getResearchRequestById(researchRequestId: number, userId: string) {
    this.spinner.show();
    this.ResearchRequestService.getResearchRequestById(researchRequestId, userId).then((res) => {
      const result = res as ResearchRequestVM;

      this.researchRequest = result;

      this.previousNums = Array<CallNumbers>();
      if (result.callNum.length > 0 && result.callNum.includes(','))
        this.previousNums = result.callNum.split(',').map(v => { return { callNum: v }; }) as CallNumbers[]
      else if (result.callNum.length > 0) {
        var item = { callNum: result.callNum } as CallNumbers
        //var item2 = { callNum: '0' } as CallNumbers
        this.previousNums.push(item)
        //this.previousNums.push(item2)
      }
      this.getRoomsList();
      if (this.researchRequest.roomId) {
        this.getResearchAvailableDatesByRoomId();
      }
      this.setSelectedDates(this.researchRequest.dateFrom, this.researchRequest.dateTo);
      this.spinner.hide();
    });
  }

  setSelectedDates(startDate: string, endDate: string) {
    let selectedStartYear = startDate.split('-')[0];
    let selectedStartMonth = startDate.split('-')[1];
    let selectedStartDay = startDate.split('-')[2].substring(0, 2);

    let selectedEndYear = endDate.split('-')[0];
    let selectedEndMonth = endDate.split('-')[1];
    let selectedEndDay = endDate.split('-')[2].substring(0, 2);

    this.fromDate = new NgbDate(+selectedStartYear, +selectedStartMonth, +selectedStartDay);
    this.toDate = new NgbDate(+selectedEndYear, +selectedEndMonth, +selectedEndDay);
  }

  changeRoomId() {
    if (this.researchRequest.requestTypeId == this.researchOnlyTypeId || this.researchRequest.requestTypeId == this.researchAndSubjectTypeId) {
      this.getResearchAvailableDatesByRoomId();
    }
  }

  getResearchAvailableDatesByRoomId() {
    this.researchAvailableDatesPeriodsList = [];
    this.ResearchRequestService.getResearchAvailableDatesByRoomId(this.researchRequest.roomId).then((res) => {
      const result = res as Array<ResearchAvailableDateVM>;

      this.researchAvailableDatesList = result;

      this.disableDays();
    });
  }

  disableDays() {
    if (this.researchRequest.requestTypeId != ResearchRequestTypesEnum.Subject) {
      this.isDisabled = (date: NgbDateStruct) => {
        const calenderDate = new Date(date.year, date.month - 1, date.day);

        var disabled = true;
        for (let index = 0; index < this.researchAvailableDatesList.length; index++) {

          var currentTime = new Date(this.researchAvailableDatesList[index].date);
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
  }

  isDisabled = (date: NgbDateStruct) => {
    return this.researchRequest?.requestTypeId == ResearchRequestTypesEnum.Subject ? false : true;

    // return this.enabledDates.find(x => new NgbDate(x.year, x.month, x.day).equals(date)) ?
    //   false : true;
  }

  setSelectedStartAndEndDates() {
    if (this.fromDate && this.toDate) {
      this.researchRequest.dateFrom = this.fromDate.year + '-' + (this.fromDate.month > 9 ? this.fromDate.month : '0' + this.fromDate.month) + '-' + (this.fromDate.day > 9 ? this.fromDate.day : '0' + this.fromDate.day);
      this.researchRequest.dateTo = this.fromDate.year + '-' + (this.toDate.month > 9 ? this.toDate.month : '0' + this.toDate.month) + '-' + (this.toDate.day > 9 ? this.toDate.day : '0' + this.toDate.day);

      if ((this.fromDate.equals(this.minDatePicker) || this.fromDate.after(this.minDatePicker)) && this.toDate.after(this.minDatePicker)) {
        if (this.researchRequest.requestTypeId != ResearchRequestTypesEnum.Subject) {
          this.researchRequest.researchStartDateId = this.researchAvailableDatesList.find(date => date.date.split('T')[0] == this.researchRequest.dateFrom).id;
          this.researchRequest.researchEndDateId = this.researchAvailableDatesList.find(date => date.date.split('T')[0] == this.researchRequest.dateTo).id;
        }
        this.validDates = true;
      }
      else {
        this.validDates = false;
        this.openModal();
        this.confirmationModalService.modalType = 'message';
        this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please make sure the request start and end dates are valid first"
          : "من فضلك تأكد من صلاحية تاريخ بداية و نهاية الطلب أولاً";
        this.confirmationModalService.caller = this;
      }
    }
  }

  confirmSubmission(f: NgForm) {
    if ((this.researchRequest.requestTypeId == ResearchRequestTypesEnum.Subject) || (this.researchRequest.requestTypeId != ResearchRequestTypesEnum.Subject && this.researchAvailableDatesList.length)) {
      this.setSelectedStartAndEndDates();
    }
    if (f.valid && this.validDates && this.researchRequest.dateFrom && this.researchRequest.dateTo) {
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
      window.scrollTo(0, 0);
      if (!this.researchRequest.dateFrom || !this.researchRequest.dateTo) {
        this.openModal();
        this.confirmationModalService.modalType = 'message';
        this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please determine request start and end dates first"
          : "من فضلك حدد تاريخ بداية و نهاية الطلب أولاً";
        this.confirmationModalService.caller = this;
      }
    }
  }

  submitForm() {
    if (this.isEditMode) {

      this.researchRequest.callNum = this.previousNums.map(c => c.callNum).join(',')

      if (this.callNumbersArray) {

        this.CallNumbers = this.callNumbersArray.controls.map(c => c.value);
        if (this.CallNumbers && this.CallNumbers.length > 0)

          if (this.CallNumbers.map(c => c.callNum)[0] != null)
          {
            this.researchRequest.callNum += ',' + this.CallNumbers.map(c => c.callNum).join(',')
          }
           
          // else
          //   this.researchRequest.callNum += ',' + this.CallNumbers.map(c => c.callNum).join(',')
      }
      this.researchRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.ResearchRequestService.updateResearchRequest(this.researchRequest).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/research-retreat-view");
            }, 2000);
          }
        });
    }
    else {

      this.CallNumbers = this.callNumbersArray.controls.map(c => c.value);
      this.researchRequest.callNum = this.CallNumbers.map(c => c.callNum).join(',')


      this.researchRequest.userId = this.userId;
      this.researchRequest.createdBy = this.userId;
      this.researchRequest.requestStatusId = 4; //Pending by default
      this.spinner.show();
      this.global.Messages = [];
      this.ResearchRequestService.createNewResearchRequest(this.researchRequest).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/research-retreat-view");
            }, 2000);
          }
        });
    }
  }

  removePrevcallNumbers(index: number) {
    this.previousNums.splice(index, 1);
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
