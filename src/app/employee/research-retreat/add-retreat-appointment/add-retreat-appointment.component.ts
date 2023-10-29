import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ResearchAvailableDateVM } from 'src/app/shared/models/VM/basicData/ResearchAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';

@Component({
  selector: 'app-add-retreat-appointment',
  templateUrl: './add-retreat-appointment.component.html',
  styleUrls: ['./add-retreat-appointment.component.scss']
})
export class AddRetreatAppointmentComponent implements OnInit {

  selectedDate: string;
  periodsList: Array<any> = new Array<any>();

  startDatePicker: NgbDateStruct;
  model = {
    per_sat: false ,
    per_sat2: false,
  };
  minDatePicker: { year: number; month: number; day: number; };

  constructor(public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private appointmentService: AppointmentService,
    public ResearchRequestService: ResearchRequestService) {
    const current = new Date();
    this.minDatePicker = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
  }

  setSelectedDate(date: NgbDate){
    this.selectedDate = date.year +'-'+ date.month +'-'+ date.day;
  }

  confirmSelection(){
      this.appointmentService.generateSelectedResearchAvailableDate(this.selectedDate);
  }
}
