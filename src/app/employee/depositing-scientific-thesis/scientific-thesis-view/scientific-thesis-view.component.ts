import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { ThesisDepositionRequestService } from 'src/app/shared/services/businessServices/thesisDepositionRequest.service';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ThesisDepositionRequestVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestVM';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-scientific-thesis-view',
  templateUrl: './scientific-thesis-view.component.html',
  styleUrls: ['./scientific-thesis-view.component.scss']
})
export class ScientificThesisViewComponent implements OnInit {

  userId;
  listToView: Array<ThesisDepositionRequestVM>;
  requestStatusesList: CommonVM[];
  
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  minDatePicker: { year: number; month: number; day: number; };
  isOutsideKingdom :boolean = false;

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(public translate: TranslateService,
    public router: Router,
    public CommonService: CommonService,
    public ThesisDepositionRequestService: ThesisDepositionRequestService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getRequestStatusesList();
    this.getThesisDepositionlistToView();
  }

  getRequestStatusesList(){
    this.CommonService.GetCommonsByDomain("RequestStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }

  getRequestStatusById(requestStatusId: number){
    let status = this.requestStatusesList.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
  }

  getThesisDepositionlistToView() {
    this.spinner.show();
    this.ThesisDepositionRequestService.getAllThesisDepositionRequests(this.userId,this.isOutsideKingdom).then((res) => {
    const result = res as Array<ThesisDepositionRequestVM>;
  
    this.listToView = result;

    if(this.startDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

    if(this.endDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

    this.spinner.hide();
    $('#thesisDepositionDT').DataTable().destroy();
    setTimeout(() => {
      $('#thesisDepositionDT').DataTable({
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
    this.getThesisDepositionlistToView();
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.getThesisDepositionlistToView();
  }

  exportExcel() {
    let listToExport = new Array<any>();
    this.listToView.map(r => listToExport.push({'applicantName': r.applicantName, 'requestStatus': this.getRequestStatusById(r.requestStatusId), 'createdDate': r.createdDate}));
    if(this.startDate){
      listToExport = listToExport.filter(r => new Date(r.createdDate.toString().split('T')[0]) >= new Date(this.startDate));
    }
    if(this.endDate){
      listToExport = listToExport.filter(r => new Date(r.createdDate.toString().split('T')[0]) <= new Date(this.endDate));
    }

    let EXCEL_EXTENSION = '.xlsx';
    let worksheet: XLSX.WorkSheet;
    let customHeader = true;
    let sheetName = 'My Sheet 1';
    if (customHeader) {
      const headers: any = { applicantName: 'إسم السؤول عن الطلب', requestStatus: 'حالة الطلب' , createdDate: 'تاريخ الطلب'};
      listToExport.unshift(headers);
      worksheet = XLSX.utils.json_to_sheet(listToExport, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(listToExport);
    }
    const workbook = XLSX.utils.book_new();
    const fileName =  'إيداع رسالة علمية' + "_export_" + new Date().getTime() + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);  
  }

  archiveConfirmation(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to add to archive ?"
                                                                                : "هل أنت متأكد ، تريد الإضافة إلى الأرشيف ؟");
    this.confirmationModalService.model = thesisDepositionRequest;
    this.confirmationModalService.confirmAction = this.ThesisDepositionRequestService.addToArchivedAndUpdateThesisDepositionRequest;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(ThesisDepositionRequest: ThesisDepositionRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = ThesisDepositionRequest;
    this.confirmationModalService.confirmAction = this.ThesisDepositionRequestService.deleteThesisDepositionRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }

  getSource(){
    this.spinner.show();
    this.ThesisDepositionRequestService.getAllThesisDepositionRequests(this.userId,this.isOutsideKingdom).then((res) => {
    const result = res as Array<ThesisDepositionRequestVM>;
  
    this.listToView = result;

    if(this.startDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

    if(this.endDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

    this.spinner.hide();
    $('#thesisDepositionDT').DataTable().destroy();
    setTimeout(() => {
      $('#thesisDepositionDT').DataTable({
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
}
