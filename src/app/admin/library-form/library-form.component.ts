import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-library-form',
  templateUrl: './library-form.component.html',
  styleUrls: ['./library-form.component.scss']
})
export class LibraryFormComponent implements OnInit {
  userId: string;
  isEditMode: boolean;
  library = new LibraryVM();
  libraryId;
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public libraryService: LibraryService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.confirmationModalService.model != null) {
      this.isEditMode = true;
      this.libraryId = this.confirmationModalService.model.id;
      this.getLibraryById(this.libraryId);
    }
  }

  getLibraryById(libraryId: number) {
    this.libraryService.getLibraryById(libraryId).then((res) => {
      this.library = res as LibraryVM;
    });
  }

  submitForm(f: NgForm) {
    if (f.valid) {
      if (this.isEditMode) {
        this.library.updatedBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.libraryService.updateLibrary(this.library).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/libraries");
                document.location.reload();
              }, 2000);
            }
          });
      }
      else {
        this.library.createdBy = this.userId;
        this.spinner.show();
        this.global.Messages = [];
        this.libraryService.createNewLibrary(this.library).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/libraries");
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
