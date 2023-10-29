import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpRequestService } from 'src/app/shared/services/http-request.service';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiftBackRequestVM } from 'src/app/shared/models/VM/businessServices/GiftBackRequestVM';
import { GiftBackBookVM } from 'src/app/shared/models/VM/businessServices/GiftBackBookVM';
import { GiftBookRequestService } from 'src/app/shared/services/businessServices/gift-book-request.service';
import { GiftBackSearchVm } from 'src/app/shared/models/VM/businessServices/GiftBackSearchVm';
import { GiftedBookVM } from 'src/app/shared/models/VM/businessServices/GiftedBookVM';
import { RequestGiftFormComponent } from '../request-gift-form/request-gift-form.component';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-request-gift-book-list',
  templateUrl: './request-gift-book-list.component.html',
  styleUrls: ['./request-gift-book-list.component.scss']
})
export class RequestGiftBookListComponent implements OnInit {



  currentRate = 4;
  RequestId: any
  ListToView: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  ListToViewToAppend: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  GiftBackRequestVM: GiftBackRequestVM = new GiftBackRequestVM()
  isEditMode = false
  isChecked = false;
  userId: string
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
    public GiftBookRequest: GiftBookRequestService


  ) { }

  ngOnInit(): void {




    this.GiftBookRequest.setSelectedBookGiftRequest(this.ListToView)
    this.userId = this.global.getCurrentUserId();
    this.GiftBackRequestVM.userId = this.global.getCurrentUserId();
    this.GiftBackRequestVM.beneficiaryEmail = this.global.getUserFromLocalStorage().email
    this.GiftBackRequestVM.beneficiaryName = this.global.getUserFromLocalStorage().fullName
    this.GiftBackRequestVM.beneficiaryMobile = this.global.getUserFromLocalStorage().phoneNumber

    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestById(this.RequestId, this.userId);
    } else {
      this.ListToView = new Array<GiftBackBookVM>()
    }


  }
  addBook() {
    const modalRef = this.modalService.open(RequestGiftFormComponent, { centered: true, size: 'xl' });

    modalRef.result.then((data) => {

      if (this.GiftBookRequest.GetIsConfirmed() == true) {
        if (this.ListToView.length > 0) {
          let ListToViewToAppend = new Array<GiftBackBookVM>
          let newlist = this.GiftBookRequest.GetSelectedBookGiftRequest()
          this.ListToView.forEach(currentElement => {
            // let ExistItem = this.GiftBookRequest.GetSelectedBookGiftRequest().filter(c => c.standardBookNumber === currentElement.standardBookNumber)[0];
            // if (ExistItem) {
            //   currentElement.numberOfNeededCopies += ExistItem.numberOfNeededCopies
            // }else{
            //  let newItem = this.GiftBookRequest.GetSelectedBookGiftRequest().filter(c => c.standardBookNumber === currentElement.standardBookNumber)[0]
            //   this.ListToViewToAppend.push(newItem)
            // }



            newlist.forEach(newElement => {
              if (currentElement.standardBookNumber === newElement.standardBookNumber) {
                currentElement.numberOfNeededCopies += newElement.numberOfNeededCopies
              } else {
                ListToViewToAppend.push(newElement)
              }
            });

          })



          //console.log(ListToViewToAppend);
          ListToViewToAppend.forEach(newelement => {
            this.ListToView.push(newelement)
          });






        } else {

          this.ListToView = this.GiftBookRequest.GetSelectedBookGiftRequest()
        }
      }


      this.GiftBackRequestVM.giftBackBooks = this.ListToView
      this.GiftBookRequest.SetIsConfirmed(false)
    }, (reason) => {

      if (this.GiftBookRequest.GetIsConfirmed() == true) {
        if (this.ListToView.length > 0) {
          let ListToViewToAppend = new Array<GiftBackBookVM>
          let newlist = this.GiftBookRequest.GetSelectedBookGiftRequest()
          this.ListToView.forEach(currentElement => {



            newlist.forEach(newElement => {
              if (currentElement.standardBookNumber === newElement.standardBookNumber) {
                currentElement.numberOfNeededCopies += newElement.numberOfNeededCopies
              } else {
                ListToViewToAppend.push(newElement)
              }
            });

          })


          ListToViewToAppend.forEach(newelement => {
            let item = this.ListToView.filter(c => c.standardBookNumber === newelement.standardBookNumber)[0]
            if (item) {

            } else {

              this.ListToView.push(newelement)
            }
          });






        } else {

          this.ListToView = this.GiftBookRequest.GetSelectedBookGiftRequest()
        }
      }


      this.GiftBackRequestVM.giftBackBooks = this.ListToView
      this.GiftBookRequest.SetIsConfirmed(false)
    });
  }

  checkAvailable(item: GiftBackBookVM) {

    if (item.numberOfNeededCopies > item.numberOfCopiesRemaining) {
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please modify your request , quantity is not avaiable"
        : "من فضلك عدل الكميه . الكمية المطلوبه غير متاحه";
      this.confirmationModalService.caller = this;
      item.numberOfNeededCopies = 0;
    }

  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });

  }


  checkuncheckall() {
    if (this.isChecked == true) {
      //this.isChecked = false;
      this.ListToView.forEach(elem => {
        elem.isChecked = false
      })

      this.isChecked = false;
    }
    else {

      this.ListToView.forEach(elem => {
        elem.isChecked = true
      })

      this.isChecked = true;
    }

  }

  CheckSelectedBooks() {
    if (this.ListToView.length >= 0)
      return this.ListToView.filter(d => d.isChecked == true).length <= 0

    return true
  }


  confirmSubmission(f: NgForm) {


    let validate = this.FinalValidation();
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

  submitForm() {


    if (this.isEditMode == true) {
      // this.suggestion.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.GiftBookRequest.updateRequest(this.GiftBackRequestVM).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/request-gift-view");
            }, 2000);
          }
        });
    }
    else {
      this.GiftBackRequestVM.isArchived = false;
      this.GiftBackRequestVM.createdBy = !this.userId || this.userId == '0' ? 'Anonymous' : this.userId;
      this.spinner.show();
      this.global.Messages = [];

      this.GiftBookRequest.ValidateNewRequest(this.GiftBackRequestVM).then(
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

            this.GiftBookRequest.createNewRequest(this.GiftBackRequestVM).then()
              .finally(() => {
                if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
                  this.spinner.hide();
                  this.staticAlertClosed = false;
                  this.confirmationModalService.response = false;
                  setTimeout(() => {
                    this.staticAlert.close();
                    this.router.navigateByUrl("/auth/user/request-gift-view");
                  }, 2000);
                }
              });

          }
        }

      )


    }
  }


  FinalValidation(): Boolean {
    const result = this.GiftBackRequestVM.giftBackBooks.filter(c => c.numberOfNeededCopies == 0)

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


  getRequestById(RequestId: number, userId: string) {
    this.spinner.show()
    this.GiftBookRequest.getRequestById(RequestId, userId).then(
      (res) => {

        const result = res as GiftBackRequestVM
        console.log(result)
        this.GiftBackRequestVM.id = result.id
        this.GiftBackRequestVM.giftBackBooks = this.ListToView = result.giftBackBooks
        // console.log(result.giftBackBooks)
        this.spinner.hide();
      }
    )
    // .finally(() => {
    //   if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
    //     this.spinner.hide();
    //     this.staticAlertClosed = false;
    //     setTimeout(() => {
    //       this.staticAlert.close();
    //       //this.router.navigateByUrl("/auth/user/research-retreat-view");
    //     }, 2000);
    //   }
    // });

    //this.spinner.hide();
  }

  GetCheckitems() {
    return this.ListToView;//.filter(c=>c.isChecked==true)
  }

  Uncheck(item: GiftBackBookVM) {
    // console.log(item);
  }

  AssignArchiveVars(GiftBackBookVM: GiftBackBookVM, index: number) {
    this.GiftBackBookVMToArchive = GiftBackBookVM
    this.indexToArchive = index;
  }

  GiftBackBookVMToArchive: GiftBackBookVM = new GiftBackBookVM()
  indexToArchive: number = 0;

  archiveConfirmation(GiftBackBookVM: GiftBackBookVM, index: number) {
    this.AssignArchiveVars(GiftBackBookVM, index)
    this.openModal();
    this.confirmationModalService.modalType = 'delete2';
    this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure ?,this book will be restored to the stock and might be reserved by another user"
      : "سيتم الغاء حجز هذا الكتاب وربما يتم سحبه من طرف مستخدم اخر . هل أنت متأكد .؟")
      : (this.translate.currentLang == 'en' ? "Are you sure ?,this book will be restored to the stock and might be reserved by another user"
        : "سيتم الغاء حجز هذا الكتاب وربما يتم سحبه من طرف مستخدم اخر . هل أنت متأكد .؟");
    this.confirmationModalService.caller = this;



  }
  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
  submitForm2() {


    this.ListToView.splice(this.indexToArchive, 1);
    this.GiftBackBookVMToArchive.isChecked = false;

  }

}
