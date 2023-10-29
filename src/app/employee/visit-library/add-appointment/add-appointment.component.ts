import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { VisitAvailableDateVM } from 'src/app/shared/models/VM/basicData/VisitAvailableDateVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent implements OnInit {

  selectedDate: string;
  periodsList: Array<any> = new Array<any>();
  selectedVisitAvailableDatesList: Array<VisitAvailableDateVM> = new Array<VisitAvailableDateVM>();

  startDatePicker: NgbDateStruct;
  model = {
    per_sat: false ,
    per_sat2: false,
  };
  minDatePicker: { year: number; month: number; day: number; };

  constructor(public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    public translate: TranslateService,
    private appointmentService: AppointmentService,
    public VisitRequestService: VisitRequestService) {
    const current = new Date();
    this.minDatePicker = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    this.getAllPeriods();
  }

  getAllPeriods(){
    this.VisitRequestService.getAllDaysPeriods().then((res) => {
      const result = res as Array<PeriodVM>;

      result.map(x=> this.periodsList
        .push({'id' : x.id, 'from': x.periodFrom, 'to': x.periodTo, 'periodOfTheDayFrom': this.translate.currentLang == 'en' ? x.periodOfTheDayFrom : x.periodOfTheDayFromAr,'periodOfTheDayTo': this.translate.currentLang == 'en' ? x.periodOfTheDayTo : x.periodOfTheDayToAr, 'isSelected': false}));
    });
  }

  setSelectedDate(date: NgbDate){
    this.selectedDate = date.year +'-'+ date.month +'-'+ date.day;
  }

  setSelectedPeriod(index: number){
    if(this.periodsList[index].isSelected){
      this.periodsList[index].isSelected = false;
      this.selectedVisitAvailableDatesList.splice(index, 1);
    }else{
      this.periodsList[index].isSelected = true;
      if(!this.selectedVisitAvailableDatesList[index]){
        let selection = new VisitAvailableDateVM();
        selection.date = this.selectedDate;
        selection.periodId = this.periodsList[index].id;
        this.selectedVisitAvailableDatesList.push(selection);
      }
    }
  }

  confirmSelection(){
    if(this.selectedVisitAvailableDatesList.length){
      this.appointmentService.generateSelectedVisitAvailableDates(this.selectedVisitAvailableDatesList, this.selectedDate);
    }else{

    }
  }
}
