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
import { CopyRequestService } from 'src/app/shared/services/businessServices/copy-request.service';
import { CopyRequestSearchRequestVM } from 'src/app/shared/models/VM/businessServices/CopyRequestSearchRequestVM';
import { CopyRequestSearchResponseVM, Instance } from 'src/app/shared/models/VM/businessServices/CopyRequestSearchResponseVM';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

  ListToView: Instance[]
  SearchVM: CopyRequestSearchRequestVM = new CopyRequestSearchRequestVM()
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
    private CopyRequestService: CopyRequestService,




  ) { }
  ngOnInit(): void {
  }




  Clear() {
    this.SearchVM = new CopyRequestSearchRequestVM();
    this.ListToView = new Array<Instance>();
    $('#bookSearch').DataTable().clear().draw();
    $('#bookSearch').DataTable().destroy();
  }


  Search() {
    if (!this.SearchVM.author && !this.SearchVM.title && !this.SearchVM.publisher)
      return;
    this.spinner.show();
    this.SearchVM.medadLibId =  this.CopyRequestService.GetMedadLibId();
    this.CopyRequestService.SearchBooks(this.SearchVM).then(
      (res) => {

        const result = res as CopyRequestSearchResponseVM

        if (res) {

          // console.log(res)
          this.ListToView = res.instances
          this.spinner.hide();
          $('#bookSearch').DataTable().clear().draw();
          $('#bookSearch').DataTable().destroy();
          setTimeout(() => {
            $('#bookSearch').DataTable({
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

      }
    )
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

  clearCheck() {
    this.ListToView.forEach(element => {
      {
        element.isChecked = false
      }


    });
  }
  CheckOnlyOne(Id: string) {
    this.clearCheck();
  }

  Add() {
    let item = this.ListToView.filter(c => c.isChecked == true)[0]
    // console.log(item);

    this.CopyRequestService.SetIsConfirmed(true);
    this.CopyRequestService.SetSelectedBookTitle(item.title)

    this.closeModal();
  }

  closeModal() {
    this.activeModal.dismiss('Cross click')

  }
}
