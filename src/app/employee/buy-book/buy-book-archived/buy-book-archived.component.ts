import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-buy-book-archived',
  templateUrl: './buy-book-archived.component.html',
  styleUrls: ['./buy-book-archived.component.scss']
})
export class BuyBookArchivedComponent implements OnInit {

  userId: string;
  // dtOptions: DataTables.Settings = {};
  // pageNumber: number = 1;
  // pageSize: number = 10;
  listToView: Array<SuggestionVM>;

  constructor(public translate: TranslateService,
    public router: Router,
    public suggestionService: SuggestionService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: this.pageSize
    // }
    this.userId = this.global.getCurrentUserId();
    this.getArchivedSuggestionsList(this.userId);
  }

  getArchivedSuggestionsList(userId: string) {
    this.spinner.show();
    this.suggestionService.getArchivedSuggestionsList(userId).then((res) => {
    const result = res as Array<SuggestionVM>;
  
    this.listToView = result;
    this.spinner.hide();
    setTimeout(() => {
      $('#byBookDT').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25,100],
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
    });
  }

  unArchiveConfirmation(suggestion: SuggestionVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to restore from archive ?"
                                                                                : "هل أنت متأكد ، تريد الإستعادة من الأرشيف ؟");
    this.confirmationModalService.model = suggestion;
    this.confirmationModalService.confirmAction = this.suggestionService.unArchiveAndUpdateSuggestion;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(suggestion: SuggestionVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = 'delete';
    this.confirmationModalService.model = suggestion;
    this.confirmationModalService.confirmAction = this.suggestionService.deleteSuggestion;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
