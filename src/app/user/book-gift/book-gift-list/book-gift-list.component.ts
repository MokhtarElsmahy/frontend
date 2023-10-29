import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { GiftedBookVM } from 'src/app/shared/models/VM/businessServices/GiftedBookVM';

@Component({
  selector: 'app-book-gift-list',
  templateUrl: './book-gift-list.component.html',
  styleUrls: ['./book-gift-list.component.scss']
})

export class BookGiftListComponent implements OnInit {

  userId: string;
  isEditMode: boolean;
  giftRequest = new GiftRequestVM();
  giftRequestId;
  listToView;
  staticAlertClosed = true;
  constructor(private _fb: FormBuilder,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public giftRequestService: GiftRequestService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
      this.userId = this.global.getCurrentUserId();
      let route = this.router.url.split('/');
      this.giftRequestId = route[route.length-1];
      this.getGiftRequestById(this.giftRequestId, this.userId);
  }

  getGiftRequestById(giftRequestId: number, userId: string) {
    this.spinner.show();
    this.giftRequestService.getGiftRequestById(giftRequestId, userId).then((res) => {
      this.giftRequest = res as GiftRequestVM;
      this.listToView = this.giftRequest.giftedBooks;
      this.spinner.hide();
    });
  }

  deleteConfirmation(book: GiftedBookVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to delete ?"
                                                                                : "هل أنت متأكد ، تريد الحذف ؟");
    this.confirmationModalService.model = book;
    this.confirmationModalService.confirmAction = this.giftRequestService.deleteGiftedBook;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
