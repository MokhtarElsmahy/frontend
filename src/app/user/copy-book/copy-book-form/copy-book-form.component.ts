import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

import { BookListComponent } from '../book-list/book-list.component';
import { CopyRequestService } from 'src/app/shared/services/businessServices/copy-request.service';
import { CopyRequestVM } from 'src/app/shared/models/VM/businessServices/CopyRequestVM';
import { MedadLibVM } from 'src/app/shared/models/VM/businessServices/MedadLibVM';

@Component({
  selector: 'app-copy-book-form',
  templateUrl: './copy-book-form.component.html',
  styleUrls: ['./copy-book-form.component.scss']
})
export class CopyBookFormComponent implements OnInit {
  
  isEditMode = false
  CopyRequestVM : CopyRequestVM = new CopyRequestVM();
  MedadLibVM :MedadLibVM
  staticAlertClosed = true;
  RequestId;
  MedadlibraryId;
  userId: string;


  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  constructor(public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService,
    private CopyRequestService : CopyRequestService
    


  ) { }
  ngOnInit(): void {
    this.CopyRequestVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.CopyRequestVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
    this.CopyRequestVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.GetMedadLibs();
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getCopyRequestById(this.RequestId, this.userId);
      
    } 
  }

  addBook() {
    const modalRef = this.modalService.open(BookListComponent, { centered: true, size: 'xl' });

    modalRef.result.then((data) => {

      if (this.CopyRequestService.GetIsConfirmed() == true) {
       this.CopyRequestVM.bookTitle = this.CopyRequestService.GetSelectedBookTitle()
      }

      this.CopyRequestService.SetIsConfirmed(false)
    }, (reason) => {

      if (this.CopyRequestService.GetIsConfirmed() == true) {
        this.CopyRequestVM.bookTitle = this.CopyRequestService.GetSelectedBookTitle()
      }


     
      this.CopyRequestService.SetIsConfirmed(false)
    });

  }

  getCopyRequestById(CopyRequestId: number, userId: string) {
    const MedadIDs=[
      {
        //رجال
        id:"77109509-2542-4482-9ec9-32b3d18a90b4",
        DatabaseID :1 
      },
      {
        //نساء
        id:"847220d6-a710-4430-916e-886b3bd43a4b",
        DatabaseID :2 
      }, 
      {
        //المسجد الحرام
        id:"c9f16e47-09b6-4ef4-ae94-1d43b8bd1a2f",
        DatabaseID :3 
      }
    ]
    this.CopyRequestService.getCopyRequestById(CopyRequestId, userId).then((res) => {
      const result =   res as CopyRequestVM;
      this.CopyRequestVM =result;
      this.MedadlibraryId = MedadIDs.filter(c=>c.DatabaseID==this.CopyRequestVM.libraryId)[0]?.id
      this.CopyRequestService.SetMedadLibId(this.MedadlibraryId);
    });
  }

  GetMedadLibs(){
    this.CopyRequestService.GetMedadLibs().then((res) => {
      this.MedadLibVM = res as MedadLibVM;
    });
  }
  setLibraryId(MedadLibId){
    const MedadIDs=[
      {
        //رجال
        id:"77109509-2542-4482-9ec9-32b3d18a90b4",
        DatabaseID :1 
      },
      {
        //نساء
        id:"847220d6-a710-4430-916e-886b3bd43a4b",
        DatabaseID :2 
      }, 
      {
        //المسجد الحرام
        id:"c9f16e47-09b6-4ef4-ae94-1d43b8bd1a2f",
        DatabaseID :3 
      }
    ]
   this.CopyRequestVM.libraryId = MedadIDs.filter(c=>c.id==MedadLibId)[0].DatabaseID
   this.CopyRequestService.SetMedadLibId(MedadLibId);
    //console.log();
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
  confirmSubmission(f: NgForm) {
    if (f.valid) {
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
    }
  }

  submitForm() {
   
    if(this.isEditMode==true){
      this.CopyRequestVM.updatedDate = new Date();
      this.CopyRequestVM.updatedBy = this.userId
      this.spinner.show();
      this.CopyRequestVM.isOutsideKingdom=false
      this.CopyRequestService.updateCopyRequest(this.CopyRequestVM).then()
      .finally(() => {
        if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
          this.spinner.hide();
          this.staticAlertClosed = false;
          this.confirmationModalService.response = false;
          setTimeout(() => {
            this.staticAlert.close();
            this.router.navigateByUrl("/auth/user/copy-book-view");
          }, 2000);
        }
      });

    }else{
      this.spinner.show();
      this.CopyRequestVM.createdBy = this.global.getCurrentUserId();
      this.CopyRequestVM.createdDate = new Date();
      this.CopyRequestVM.updatedDate = null;
      this.CopyRequestVM.isArchived=false;
      this.CopyRequestVM.requestStatusId = RequestStatusEnum.Pending
      this.CopyRequestVM.isOutsideKingdom=false
      this.CopyRequestService.createNewCopyRequest(this.CopyRequestVM).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            this.confirmationModalService.response = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/copy-book-view");
            }, 2000);
          }
        });
    }

  }

}
