import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { RoomAvailableDayVM } from 'src/app/shared/models/VM/basicData/RoomAvailableDayVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-research-retreat-schedule',
  templateUrl: './research-retreat-schedule.component.html',
  styleUrls: ['./research-retreat-schedule.component.scss']
})
export class ResearchRetreatScheduleComponent implements OnInit {

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
  roomId: number;
  librariesList: Array<LibraryVM>;
  roomsList: Array<RoomVM>;
  daysList: Array<any> = new Array<any>();
  selectedRoomsDays: Array<RoomAvailableDayVM> = new Array<RoomAvailableDayVM>();
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    public router: Router,
    public ResearchRequestService: ResearchRequestService,
    public LibraryService: LibraryService,
    public RoomService: RoomService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getLibrariesList();
  }

  displayRoomAvailableDays() {
    this.ResearchRequestService.getRoomAvailableDaysByRoomId(this.libraryId).then((res) => {
      const result = res as Array<RoomAvailableDayVM>;
      
      this.resetWeekView();
      result.forEach(r => {
        switch(r.dayOfTheWeek){
          case "Saturday":
            this.weekModel.sat = true;
            break;
            case "Sunday":
            this.weekModel.sun = true;
            break;
            case "Monday":
              this.weekModel.mon = true;
              break;
              case "Tuesday":
            this.weekModel.tue = true;
            break;
            case "Wednesday":
            this.weekModel.wed = true;
            break;
            case "Thursday":
              this.weekModel.tha = true;
            break;
            case "Friday":
            this.weekModel.fri = true;
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
    this.selectedRoomsDays = [];
  }

  getLibrariesList() {
    this.LibraryService.getLibrariesList().then((res) => {
      const result = res as Array<LibraryVM>;

      this.librariesList = result;
    });
  }

  getRoomsList() {
    this.roomsList = [];
    this.RoomService.getRoomsByLibraryId(this.libraryId).then((res) => {
      const result = res as Array<RoomVM>;

      this.roomsList = result;
    });
  }

  collectSelectionsFromView() {
    if(this.weekModel.sat){
      this.addToUpdateList('Saturday');
    }
    if(this.weekModel.sun){
      this.addToUpdateList('Sunday');
    }
    if(this.weekModel.mon){
      this.addToUpdateList('Monday');
    }
    if(this.weekModel.tue){
      this.addToUpdateList('Tuesday');
    }
    if(this.weekModel.wed){
      this.addToUpdateList('Wednesday');
    }
    if(this.weekModel.tha){
      this.addToUpdateList('Thursday');
    }
    if(this.weekModel.fri){
      this.addToUpdateList('Friday');
    }
  }

  addToUpdateList(dayOfTheWeek: string) {
    let selectedRoomDay = new RoomAvailableDayVM();
    selectedRoomDay.roomId = this.roomId;
    selectedRoomDay.dayOfTheWeek = dayOfTheWeek;
    selectedRoomDay.createdBy = this.userId;
    this.selectedRoomsDays.push(selectedRoomDay);
  }

  updateRoomAvailableDays() {
    this.collectSelectionsFromView();
    if (this.selectedRoomsDays.length && this.libraryId && this.userId) {
      this.spinner.show();
      this.global.Messages = [];
      this.ResearchRequestService.updateRoomAvailableDays(this.selectedRoomsDays).then()
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
      this.roomId = null;
      this.resetWeekView();
    }
  }
}
