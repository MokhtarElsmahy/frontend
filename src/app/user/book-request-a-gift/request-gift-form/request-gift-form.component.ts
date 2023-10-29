import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-request-gift-form',
  templateUrl: './request-gift-form.component.html',
  styleUrls: ['./request-gift-form.component.scss']
})
export class RequestGiftFormComponent implements OnInit {

  ListToView: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  ListToCheck: Array<GiftBackBookVM> = new Array<GiftBackBookVM>()
  GiftBackBookSearch: GiftBackSearchVm = new GiftBackSearchVm()

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
  }
  isChecked = false;
  checkuncheckall() {


    if (this.isChecked == true) {
      this.isChecked = false;
    }
    else {
      this.isChecked = true;
    }

  }
  PublicationDate: string = null;
  PublicationDatePicker: NgbDateStruct;
  sePublicationDate(date: NgbDate) {
    this.PublicationDate = date.year + '-' + date.month + '-' + (date.day + 1);
    this.GiftBackBookSearch.publicationDate = new Date(this.PublicationDate);

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

  ClearForm() {
    this.GiftBackBookSearch = new GiftBackSearchVm()
    this.ListToView = new Array<GiftBackBookVM>()
    this.PublicationDate = null;
    this.PublicationDatePicker = null;

  }

  checkValidationSelection() : string{
    let ValidationMsg = "";
    this.ListToView.forEach(element => {
      if ((element.isChecked == true && element.numberOfNeededCopies <= 0) ||(element.isChecked == true && !element.numberOfNeededCopies)) {
        if (this.translate.currentLang == 'en')
          ValidationMsg +='<div>'+ `Please modify number of copies for ${element.bookTitle}`+'</div>'
        else {
          ValidationMsg +='<div>'+ `${element.bookTitle} يرجى تعديل الكمية للكتاب`+'</div>'
        }
      }
    });

   
    return ValidationMsg;
  }

  AddUpdate() {

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




        this.GiftBookRequest.SetIsConfirmed(true);
        //this.GiftBookRequest.setSelectedBookGiftRequest(new Array<GiftedBookVM>())
        this.GiftBookRequest.setSelectedBookGiftRequest(this.ListToView.filter(d => d.isChecked == true && d.numberOfNeededCopies > 0))

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
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });


  }

  closeModal() {
    this.activeModal.dismiss('Cross click')

  }

  CheckSelectedBooks() {
    if (this.ListToView.length >= 0)
      return this.ListToView.filter(d => d.isChecked == true).length <= 0

    return true
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

  GetAllAvailableGiftedBooks(){
    this.ListToView = null;
    this.ListToView = new Array<GiftBackBookVM>();
    this.spinner.show();
    // console.log(this.GiftBackBookSearch);

    this.GiftBookRequest.GetAllAvailableGiftedBooks().then(
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



}
