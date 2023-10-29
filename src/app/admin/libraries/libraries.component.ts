import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { LibraryVM } from 'src/app/shared/models/VM/basicData/LibraryVM';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryFormComponent } from '../library-form/library-form.component';

@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent implements OnInit {

  userId: string;
  listToView: Array<LibraryVM>;

  constructor(public translate: TranslateService,
    public router: Router,
    public libraryService: LibraryService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getLibrariesList();
  }

  getLibrariesList() {
    this.spinner.show();
    this.libraryService.getLibrariesList().then((res) => {
    const result = res as Array<LibraryVM>;
  
    this.listToView = result;
    this.spinner.hide();
    setTimeout(() => {
      $('#lib').DataTable({
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

  deleteConfirmation(library: LibraryVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = library;
    this.confirmationModalService.confirmAction = this.libraryService.deleteLibrary;
    this.confirmationModalService.caller = this;
  }
  
  addlibrary(library?: LibraryVM) {
    const modalRef = this.modalService.open(LibraryFormComponent, { centered: true , size: 'md' });
    this.confirmationModalService.model = library;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
