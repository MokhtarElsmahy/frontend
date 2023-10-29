import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { RoomVM } from 'src/app/shared/models/VM/basicData/RoomVM';
import { RoomService } from 'src/app/shared/services/basicData/room.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-hall-form',
  templateUrl: './hall-form.component.html',
  styleUrls: ['./hall-form.component.scss']
})
export class HallFormComponent implements OnInit {
  userId: string;
  isEditMode: boolean;
  room = new RoomVM();
  roomId;
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public roomService: RoomService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.confirmationModalService.model != null && this.confirmationModalService.model.libraryId) {
      this.isEditMode = true;
      this.roomId = this.confirmationModalService.model.id;
      this.getRoomById(this.roomId, this.userId);
    }
  }

  getRoomById(roomId: number, userId: string) {
    this.roomService.getRoomById(roomId).then((res) => {
      this.room = res as RoomVM;
    });
  }

  submitForm(f: NgForm) {
    if (f.valid) {
      if (this.isEditMode) {
        this.room.updatedBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.roomService.updateRoom(this.room).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/halls");
                document.location.reload();
              }, 2000);
            }
          });
      }
      else {
        this.room.libraryId = this.confirmationModalService.model.id;
        this.room.createdBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.roomService.createNewRoom(this.room).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/halls");
                document.location.reload();
              }, 2000);
            }
          });
      }
    }
    else {
      f.form.markAllAsTouched();
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
