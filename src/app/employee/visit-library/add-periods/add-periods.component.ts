import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { PeriodVM } from 'src/app/shared/models/VM/basicData/PeriodVM';
import { PeriodService } from 'src/app/shared/services/basicData/period.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-add-periods',
  templateUrl: './add-periods.component.html',
  styleUrls: ['./add-periods.component.scss']
})
export class AddPeriodsComponent implements OnInit {
  userId: string;
  isEditMode: boolean;
  isValidToSave: boolean;
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  meridian = true;
  startTime = { hour: 0, minute: 0 };
  endTime = { hour: 0, minute: 0 };
  
  listToView: Array<PeriodVM>;
  period: PeriodVM = new PeriodVM();

  constructor(public translate: TranslateService,
    public router: Router,
    public periodService: PeriodService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getPeriodsList();
  }

  getPeriodsList() {
    this.periodService.getPeriodsList().then((res) => {
      const result = res as Array<PeriodVM>;

      this.listToView = result;
    });
  }

  setStartTime(time: any) {
    if (this.startTime != null) {
      this.period.periodFrom = (time.hour > 0 ? (time.hour > 12 ? ((time.hour - 12) < 10 ? '0' : '') + (time.hour - 12) : (time.hour < 10 ? '0' : '') + time.hour) : '12') + ':' + (time.minute < 10 ? '0' + time.minute : time.minute);
      if (time.hour > 12) {
        this.period.periodOfTheDayFrom = 'PM';
        this.period.periodOfTheDayFromAr = 'مساءاً';
      }
      else {
        this.period.periodOfTheDayFrom = 'AM';
        this.period.periodOfTheDayFromAr = 'صباحاً';
      }
    }
  }

  setEndTime(time: any) {
    if (this.startTime != null && this.endTime != null){
      if (time.hour > this.startTime.hour || (time.hour == this.startTime.hour && time.minute > this.startTime.minute)) {
        this.period.periodTo = (time.hour > 0 ? (time.hour > 12 ? ((time.hour - 12) < 10 ? '0' : '') + (time.hour - 12) : (time.hour < 10 ? '0' : '') + time.hour) : '12') + ':' + (time.minute < 10 ? '0' + time.minute : time.minute);
        if (time.hour > 12) {
          this.period.periodOfTheDayTo = 'PM';
          this.period.periodOfTheDayToAr = 'مساءاً';
        }
        else {
          this.period.periodOfTheDayTo = 'AM';
          this.period.periodOfTheDayToAr = 'صباحاً';
        }
        this.isValidToSave = true;
      }
      else {
        this.isValidToSave = false;
        this.openModal();
        this.confirmationModalService.modalType = 'message';
        this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please check the end time first, it must be greater than the start time"
          : "من فضلك تحقق من وقت النهاية أولاً ، يجب أن يكون أكبر من وقت البداية";
        this.confirmationModalService.caller = this;
      }
    }
  }

  getPeriodTimesForEdit(period: PeriodVM){
    window.scrollTo(0,0);
    this.isEditMode = true;
    this.period = period;
    let hourFrom = period.periodOfTheDayFrom == 'AM' ? (+period.periodFrom.split(':')[0] != 12 ? +period.periodFrom.split(':')[0] : 0) : +period.periodFrom.split(':')[0] + 12;
    let minuteFrom = +period.periodFrom.split(':')[1];
    let hourTo = period.periodOfTheDayTo == 'AM' ? (+period.periodTo.split(':')[0] != 12 ? +period.periodTo.split(':')[0] : 0) : +period.periodTo.split(':')[0] + 12;
    let minuteTo = +period.periodTo.split(':')[1];
    this.startTime = {hour: hourFrom, minute: minuteFrom};
    this.endTime = {hour: hourTo, minute: minuteTo};
  }

  deleteConfirmation(period: PeriodVM) {
    this.periodService.isPeriodDeletable(period.id).then((res) => {
      let isDeletable = res as boolean;
      if(isDeletable){
        this.openModal();
        this.confirmationModalService.modalType = 'delete';
        this.confirmationModalService.model = period;
        this.confirmationModalService.confirmAction = this.periodService.deletePeriod;
        this.confirmationModalService.caller = this;
      } 
      else {
        this.openModal();
        this.confirmationModalService.modalType = 'message';
        this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Connot delete this period as it`s related to requests had been approved before"
                                                                                   : "لا يمكن حذف هذه الفترة نظراً لارتباطها بطلبات تم الموافقة عليها مسبقاً";
        this.confirmationModalService.caller = this;
      }
    });
  }

  submitForm() {
    this.setStartTime(this.startTime);
    this.setEndTime(this.endTime);
    if (this.isValidToSave) {
      if (this.isEditMode) {
        this.period.updatedBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.periodService.updatePeriod(this.period).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.isEditMode = false;
                this.getPeriodsList();
              }, 2000);
            }
          });
      }
      else {
        this.period.createdBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.periodService.createNewPeriod(this.period).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.getPeriodsList();
              }, 2000);
            }
          });
      }
    }
    else if(this.startTime == null || this.endTime == null){
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please determine valid start and end times first"
                                                                                 : "من فضلك حدد أوقات بداية و نهاية صالحة أولاً";
      this.confirmationModalService.caller = this;
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}