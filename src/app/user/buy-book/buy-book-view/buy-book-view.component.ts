import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-buy-book-view',
  templateUrl: './buy-book-view.component.html',
  styleUrls: ['./buy-book-view.component.scss']
})
export class BuyBookViewComponent implements OnInit {

  userId: string;
  // dtOptions: DataTables.Settings = {};
  // pageNumber: number = 1;
  // pageSize: number = 10;
  listToView: Array<SuggestionVM>;
  requestsCount: number;
  
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  minDatePicker: { year: number; month: number; day: number; };
  
  constructor(public translate: TranslateService,
    public router: Router,
    public suggestionService: SuggestionService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    public printService: PrintService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: this.pageSize
    // }
    this.userId = this.global.getCurrentUserId();
    this.getSuggestionsList();
  }

  getSuggestionsList() {
    this.spinner.show();
    this.suggestionService.getSuggestionsList(this.userId).then((res) => {
    const result = res as Array<SuggestionVM>;
  
    this.listToView = result;

    if(this.startDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

    if(this.endDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

    this.spinner.hide();
    $('#byBookDT').DataTable().destroy();
    this.requestsCount=this.listToView.length;
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
  
  setStartDate(date: NgbDate) {
    this.startDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.minDatePicker = date;
    this.getSuggestionsList();
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.getSuggestionsList();
  }

  exportExcel() {
    let listToExport = new Array<any>();
    this.listToView.map(r => listToExport.push({'visitorName': r.visitorName, 'suggestedBookTitle': r.suggestedBookTitle, 'createdDate': r.createdDate}));
    if(this.startDate){
      listToExport = listToExport.filter(r => new Date(r.createdDate.toString().split('T')[0]) >= new Date(this.startDate));
    }
    else if(this.endDate){
      listToExport = listToExport.filter(r => new Date(r.createdDate.toString().split('T')[0]) <= new Date(this.endDate));
    }

    let EXCEL_EXTENSION = '.xlsx';
    let worksheet: XLSX.WorkSheet;
    let customHeader = true;
    let sheetName = 'My Sheet 1';
    if (customHeader) {
      const headers: any = { visitorName: 'إسم السؤول عن الطلب', suggestedBookTitle: 'عنوان الكتاب' , createdDate: 'تاريخ الطلب'};
      listToExport.unshift(headers);
      worksheet = XLSX.utils.json_to_sheet(listToExport, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(listToExport);
    }
    const workbook = XLSX.utils.book_new();
    const fileName =  'إقتراح شراء كتاب' + "_export_" + new Date().getTime() + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);  
  }

  archiveConfirmation(suggestion: SuggestionVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to add to archive ?"
                                                                                : "هل أنت متأكد ، تريد الإضافة إلى الأرشيف ؟");
    this.confirmationModalService.model = suggestion;
    this.confirmationModalService.confirmAction = this.suggestionService.addToArchivedAndUpdateSuggestion;
    this.confirmationModalService.caller = this;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
  
  onPrint(model: SuggestionVM) {
    this.printService.setModelToPrint(model);
    this.printService.print();
  }
}
