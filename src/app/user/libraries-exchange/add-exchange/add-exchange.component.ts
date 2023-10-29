import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { GiftBackBookVM } from 'src/app/shared/models/VM/businessServices/GiftBackBookVM';
import { GiftBackSearchVm } from 'src/app/shared/models/VM/businessServices/GiftBackSearchVm';
import { LibraryExchangeBookVM, LibraryExchangeRequestVM } from 'src/app/shared/models/VM/businessServices/LibraryExchangRequestVM';
import { GiftBookRequestService } from 'src/app/shared/services/businessServices/gift-book-request.service';
import { LibraryExchangeRequestService } from 'src/app/shared/services/businessServices/library-exchange-request.service';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';


@Component({
  selector: 'app-add-exchange',
  templateUrl: './add-exchange.component.html',
  styleUrls: ['./add-exchange.component.scss']
})
export class AddExchangeComponent implements OnInit {

  ListToView: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  ListToCheck: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  LibraryExchangeBook: LibraryExchangeBookVM = new LibraryExchangeBookVM()
  GiftBackBookSearch: GiftBackSearchVm = new GiftBackSearchVm()

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
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
    public LibraryService: LibraryExchangeRequestService,
    public GiftBookRequest: GiftBookRequestService



  ) { }
  ngOnInit(): void {
  }


  Search() {

    // console.log(this.GiftBackBookSearch.publicationDate);
    // return;
    if (!this.GiftBackBookSearch.authorName && !this.GiftBackBookSearch.bookTitle && !this.GiftBackBookSearch.publisher && !this.GiftBackBookSearch.publicationDate) {
      return;
    }
    this.ListToView = null;
    this.ListToView = new Array<GiftBackBookVM>();
    this.spinner.show();
    console.log(this.GiftBackBookSearch);

    this.GiftBookRequest.SearchAvailableGiftedBooks(this.GiftBackBookSearch).then(
      (res) => {
        const result = res as Array<GiftBackBookVM>
        this.ListToView = result

        //console.log(result);
        this.spinner.hide();

        $('#bookgiftSearch').DataTable().clear().draw();
        $('#bookgiftSearch').DataTable().destroy();
        setTimeout(() => {
          $('#bookgiftSearch').DataTable({

            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
            lengthMenu: [5, 10, 25, 100],

            order: [],
            "language": {
              "lengthMenu": this.translate.currentLang == 'en' ? "Display _MENU_ in a page" : "عرض _MENU_ في الصفحة",
              "search": this.translate.currentLang == 'en' ? "Search" : "بحث",
              "paginate": {
                "last": this.translate.currentLang == 'en' ? "Last" : "الأخير",
                "first": this.translate.currentLang == 'en' ? "First" : "الأول",
                "next": this.translate.currentLang == 'en' ? "Next" : "التالي",
                "previous": this.translate.currentLang == 'en' ? "Previous" : "السابق"
              },
              "zeroRecords": this.translate.currentLang == 'en' ? "No data to show" : "لا يوجد بيانات",
              "info": this.translate.currentLang == 'en' ? "Display from _PAGE_ to _PAGES_" : "عرض صفحة  _PAGE_ من _PAGES_",
              "infoEmpty": this.translate.currentLang == 'en' ? "No data to show" : "لا يوجد بيانات",
              "infoFiltered": this.translate.currentLang == 'en' ? "Search in _MAX_ Element" : "(البحث ف _MAX_ عنصر)"
            }
          });
        }, 1);


      }


    )


  }

  checkAvailable(item: GiftBackBookVM) {

    // console.log(item);
    if (item.numberOfNeededCopies > item.numberOfCopiesRemaining) {
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please modify your request , quantity is not avaiable"
        : "من فضلك عدل الكميه . الكمية المطلوبه غير متاحه";
      this.confirmationModalService.caller = this;
      item.numberOfNeededCopies = 0;
    }

  }
  CheckSelectedBooks() {
    if (this.ListToView.length >= 0)
      return this.ListToView.filter(d => d.isChecked == true).length <= 0

    return true
  }
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });


  }

  closeModal() {
    this.activeModal.dismiss('Cross click')

  }
  ClearForm() {
    this.GiftBackBookSearch = new GiftBackSearchVm()
    this.ListToView = new Array<GiftBackBookVM>()
    this.PublicationDate = null;
    this.PublicationDatePicker = null;
    $('#bookgiftSearch').DataTable().clear().draw();
    $('#bookgiftSearch').DataTable().destroy();

  }
  PublicationDate: string = null;
  PublicationDatePicker: NgbDateStruct;
  isChecked = false;
  sePublicationDate(date: NgbDate) {
    this.PublicationDate = date.year + '-' + date.month + '-' + (date.day + 1);
    this.GiftBackBookSearch.publicationDate = new Date(this.PublicationDate);

  }


  ReplicaPublicationDate: string = null;
  ReplicaPublicationDatePicker: NgbDateStruct;

  seReplicaPublicationDate(date: NgbDate) {
    this.ReplicaPublicationDate = date.year + '-' + date.month + '-' + (date.day + 1);
    this.LibraryExchangeBook.replicaPublicationDate = new Date(this.ReplicaPublicationDate);
    //console.log(this.LibraryExchangeBook.replicaPublicationDate);

  }




  CheckOnlyOne() {
    this.ListToView.forEach(element => {
      {
        element.isChecked = false
      }


    });
  }

  checkValidationSelection(): string {
    let ValidationMsg = "";
    this.ListToView.forEach(element => {
      if ((element.isChecked == true && element.numberOfNeededCopies <= 0) || (element.isChecked == true && !element.numberOfNeededCopies)) {
        if (this.translate.currentLang == 'en')
          ValidationMsg += '<div>' + `Please modify number of copies for ${element.bookTitle}` + '</div>'
        else {
          ValidationMsg += '<div>' + `${element.bookTitle} يرجى تعديل الكمية للكتاب` + '</div>'
        }
      }
    });


    return ValidationMsg;
  }
  AddUpdate(f: NgForm) {


    if (f.valid) {



      let validation = this.checkValidationSelection()
      if (validation.trim().length > 0) {

        this.openModal();
        this.confirmationModalService.modalType = 'message2';
        this.confirmationModalService.message = validation;
        return;
      }
      this.spinner.show();
      let ValidationMsg: string = "";
      this.GiftBookRequest.SearchAvailableGiftedBooks(this.GiftBackBookSearch).then(
        (res) => {
          const result = res as Array<GiftBackBookVM>
          this.ListToCheck = result
          // console.log(this.ListToCheck)
          this.ListToCheck.forEach(elementDb => {


            let item = this.ListToView.filter(d => d.standardBookNumber === elementDb.standardBookNumber)[0]

            if (item && item.numberOfNeededCopies > elementDb.numberOfCopiesRemaining) {

              //console.log("list item : ", item)

              let msg: string = this.translate.currentLang == 'en' ? `<div> Please modify ,${item.bookTitle}, quantity became not avaiable </div> `
                : `<div>  ${item.bookTitle} : هذا الكتاب كميته اصبحت غير متاحه برجاء تعديلها </div>`

              ValidationMsg += msg


            }
          });




          this.LibraryService.SetIsConfirmed(true);
          //this.GiftBookRequest.setSelectedBookGiftRequest(new Array<GiftedBookVM>())
          let bookExchangeInfo = this.ListToView.filter(d => d.isChecked == true && d.numberOfNeededCopies > 0)[0]
          this.LibraryExchangeBook.authorName = bookExchangeInfo.authorName
          this.LibraryExchangeBook.bookStatusId = RequestStatusEnum.Pending
          this.LibraryExchangeBook.bookTitle = bookExchangeInfo.bookTitle
          this.LibraryExchangeBook.standardBookNumber = bookExchangeInfo.standardBookNumber
          this.LibraryExchangeBook.numberOfNeededCopies = bookExchangeInfo.numberOfNeededCopies
          this.LibraryExchangeBook.publicationDate = bookExchangeInfo.publicationDate
          this.LibraryExchangeBook.isChecked = true;
          this.LibraryService.SetExchangeInfo(this.LibraryExchangeBook)
         
          this.closeModal();

          if (ValidationMsg.trim().length > 0) {

            this.openModal();
            this.confirmationModalService.modalType = 'message2';
            this.confirmationModalService.message = ValidationMsg;
          } else {

          }
          this.spinner.hide();

        }

      )



      return
    } else {
      f.form.markAllAsTouched();
    }
  }


}
