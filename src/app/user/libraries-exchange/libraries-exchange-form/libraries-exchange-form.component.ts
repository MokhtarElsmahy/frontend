import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { GiftBackBookVM } from 'src/app/shared/models/VM/businessServices/GiftBackBookVM';
import { LibraryExchangeBookVM, LibraryExchangeRequestVM, LibraryExchangeSourceVM } from 'src/app/shared/models/VM/businessServices/LibraryExchangRequestVM';
import { LibraryExchangeRequestService } from 'src/app/shared/services/businessServices/library-exchange-request.service';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { AddExchangeComponent } from '../add-exchange/add-exchange.component';

@Component({
  selector: 'app-libraries-exchange-form',
  templateUrl: './libraries-exchange-form.component.html',
  styleUrls: ['./libraries-exchange-form.component.scss']
})
export class LibrariesExchangeFormComponent implements OnInit {

  RequestId: any
  SourceId: number = 1;
  LibRequestVM: LibraryExchangeRequestVM = new LibraryExchangeRequestVM()
  ListToView: Array<LibraryExchangeBookVM> = new Array<LibraryExchangeBookVM>()
  ListOfSources: Array<LibraryExchangeSourceVM> = new Array<LibraryExchangeSourceVM>()
  userId: string
  isEditMode = false
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;

  //vars of archive item 
  GiftBackBookVMToArchive: LibraryExchangeBookVM = new LibraryExchangeBookVM()
  indexToArchive: number = 0;

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
    public LibraryService: LibraryExchangeRequestService


  ) { }
  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.LibRequestVM.userId = this.global.getCurrentUserId();
    this.LibRequestVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.LibRequestVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.LibRequestVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber
    this.GetAllSources()

    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestById(this.RequestId, this.userId);
    } else {
      // this.ListToView = new Array<GiftBackBookVM>()
    }
  }

  addExchange() {

    const modalRef = this.modalService.open(AddExchangeComponent, { centered: true, size: 'xl' });
    modalRef.result.then((data) => {

      if (this.LibraryService.GetIsConfirmed() == true) {
        if (this.ListToView.length > 0) {

          const newlist = this.LibraryService.getExchangeInfo()
          newlist.sourceId =  this.SourceId;
          newlist.OtherSource =this.sourceName=='اخرى' ? this.CurrentSourceName:'-';
          this.ListToView.push(newlist)
        } else {

          const newlist = this.LibraryService.getExchangeInfo()
          newlist.sourceId =  this.SourceId;
          newlist.OtherSource =this.sourceName=='اخرى' ? this.CurrentSourceName:'-';
          this.ListToView.push(newlist)
        }


      }


      this.LibRequestVM.exchangeBooks = this.ListToView
      // console.log(this.ListToView)
      this.LibraryService.SetIsConfirmed(false)
    }, (reason) => {

      if (this.LibraryService.GetIsConfirmed() == true) {
        if (this.ListToView.length > 0) {

          const newlist = this.LibraryService.getExchangeInfo()
          newlist.sourceId =  this.SourceId;
          newlist.OtherSource =this.sourceName=='اخرى' ? this.CurrentSourceName:'-';
          this.ListToView.push(newlist)
        } else {

          const newlist = this.LibraryService.getExchangeInfo()
          newlist.sourceId =  this.SourceId;
          newlist.OtherSource =this.sourceName=='اخرى' ? this.CurrentSourceName:'-';
          this.ListToView.push(newlist)
        }
      }


      this.LibRequestVM.exchangeBooks = this.ListToView
      // console.log(this.ListToView)
      // console.log("----------")

      this.LibraryService.SetIsConfirmed(false)
    });


  }
  getRequestById(RequestId: number, userId: string) {
    this.spinner.show()
    this.LibraryService.getRequestById(RequestId, userId).then(
      (res) => {

        const result = res as LibraryExchangeRequestVM
        // console.log(result)
        this.LibRequestVM.id = result.id
        this.LibRequestVM.exchangeBooks = this.ListToView = result.exchangeBooks
        // console.log(this.LibRequestVM)
        this.spinner.hide();
      }
    )
    // .finally(() => {
    //   if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
    //     this.spinner.hide();
    //     this.staticAlertClosed = false;
    //     setTimeout(() => {
    //       this.staticAlert.close();
    //       this.router.navigateByUrl("/auth/user/libraries-exchange-view");
    //     }, 2000);
    //   }
    // });

    //this.spinner.hide();
  }

  confirmSubmission(f: NgForm) {


    let validate = this.QuantityValidation();
    if (validate == true)
      return

    this.openModal();
    this.confirmationModalService.modalType = 'confirmation';
    this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure, you want to confirm the request ?"
      : "هل أنت متأكد ، تريد تأكيد الطلب ؟")
      : (this.translate.currentLang == 'en' ? "Are you sure, you want to save the changes ?"
        : "هل أنت متأكد ، تريد حفظ التعديلات ؟");
    this.confirmationModalService.caller = this;
  }

  QuantityValidation(): Boolean {
    const result = this.LibRequestVM.exchangeBooks.filter(c => c.numberOfNeededCopies <=0 ||c.replicaNumberOfCopies<=0)

    if (result.length > 0) {
      let ValidationMsg = "";
      result.forEach(element => {
        if ((element)) {
          if (this.translate.currentLang == 'en')
            ValidationMsg += '<div>' + `Quatity can't be zero , Please modify number of copies for ${element.bookTitle}` + '</div>'
          else {
            ValidationMsg += '<div>' + `${element.bookTitle}  الكمية لا يمكن ان تكون صفر يرجى تعديل الكمية للكتاب` + '</div>'
          }
        }
      });

      if (ValidationMsg.trim().length > 0) {

        this.openModal();
        this.confirmationModalService.modalType = 'message2';
        this.confirmationModalService.message = ValidationMsg;
        this.spinner.hide();
        return true;
      }
    }
    return false
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });

  }


  submitForm() {


    if (this.isEditMode == true) {
      // this.suggestion.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.LibraryService.updateRequest(this.LibRequestVM).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/libraries-exchange-view");
            }, 2000);
          }
        });
    }
    else {
      this.LibRequestVM.isArchived = false;
      this.LibRequestVM.createdBy = !this.userId || this.userId == '0' ? 'Anonymous' : this.userId;
      this.spinner.show();
      this.global.Messages = [];

      this.LibraryService.ValidateNewRequest(this.LibRequestVM).then(
        (res) => {

          const result = res as Array<GiftBackBookVM>

          if (result.length > 0) {
            let ValidationMsg = "";
            result.forEach(element => {
              if ((element)) {
                if (this.translate.currentLang == 'en')
                  ValidationMsg += '<div>' + `Quatity was reserved , Please modify number of copies for ${element.bookTitle}` + '</div>'
                else {
                  ValidationMsg += '<div>' + `${element.bookTitle}  الكمية اصبحت غير متوفره يرجى تعديل الكمية للكتاب` + '</div>'
                }
              }
            });

            if (ValidationMsg.trim().length > 0) {

              this.openModal();
              this.confirmationModalService.modalType = 'message2';
              this.confirmationModalService.message = ValidationMsg;
              this.spinner.hide();
              return;
            }
          }
          else {

            this.LibraryService.createNewRequest(this.LibRequestVM).then()
              .finally(() => {
                if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
                  this.spinner.hide();
                  this.staticAlertClosed = false;
                  this.confirmationModalService.response = false;
                  setTimeout(() => {
                    this.staticAlert.close();
                    this.router.navigateByUrl("/auth/user/libraries-exchange-view");
                  }, 2000);
                }
              });

          }
        }

      )


    }
  }

  AssignArchiveVars(GiftBackBookVM: LibraryExchangeBookVM, index: number) {
    this.GiftBackBookVMToArchive = GiftBackBookVM
    this.indexToArchive = index;
  }


  checkAvailable(item: LibraryExchangeBookVM) {

    if (item.numberOfNeededCopies > item.numberOfCopiesRemaining) {
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please modify your request , quantity is not avaiable"
        : "من فضلك عدل الكميه . الكمية المطلوبه غير متاحه";
      this.confirmationModalService.caller = this;
      item.numberOfNeededCopies = 0;
    }

  }

  archiveConfirmation(GiftBackBookVM: LibraryExchangeBookVM, index: number) {
    this.AssignArchiveVars(GiftBackBookVM, index)
    this.openModal();
    this.confirmationModalService.modalType = 'delete2';
    this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure ?,this book will be restored to the stock and might be reserved by another user"
      : "سيتم الغاء حجز هذا الكتاب وربما يتم سحبه من طرف مستخدم اخر . هل أنت متأكد .؟")
      : (this.translate.currentLang == 'en' ? "Are you sure ?,this book will be restored to the stock and might be reserved by another user"
        : "سيتم الغاء حجز هذا الكتاب وربما يتم سحبه من طرف مستخدم اخر . هل أنت متأكد .؟");
    this.confirmationModalService.caller = this;



  }

  submitForm2() {


    this.ListToView.splice(this.indexToArchive, 1);
    this.GiftBackBookVMToArchive.isChecked = false;

  }

  GetAllSources() {

    this.LibraryService.getAllSources().then(
      (res) => {
        const result = res as Array<LibraryExchangeSourceVM>
        this.ListOfSources = result;
        // console.log(this.ListOfSources);
      }
    )
  }

 sourceName
 CurrentSourceName
  SetSource(Source: number) {
    this.SourceId=Source;
    this.sourceName = this.ListOfSources.filter(c=>c.id==Source)[0].source
    // console.log(this.SourceId);
  }

  
}
