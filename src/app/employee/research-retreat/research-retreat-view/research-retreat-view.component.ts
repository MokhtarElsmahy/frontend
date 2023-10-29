import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-research-retreat-view',
  templateUrl: './research-retreat-view.component.html',
  styleUrls: ['./research-retreat-view.component.scss']
})
export class ResearchRetreatViewComponent implements OnInit {

  // dtOptions: DataTables.Settings = {};
  // pageNumber: number = 1;
  // pageSize: number = 10;
  userId;
  listToView: Array<ResearchRequestVM>;
  requestStatusesList: CommonVM[];
  
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  minDatePicker: { year: number; month: number; day: number; };

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(public translate: TranslateService,
    public router: Router,
    public CommonService: CommonService,
    public ResearchRequestService: ResearchRequestService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: this.pageSize
    // }
    this.userId = this.global.getCurrentUserId();
    this.getRequestStatusesList();
    this.getResearchlistToView();
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

  getResearchlistToView() {
    this.spinner.show();
    this.ResearchRequestService.getAllResearchRequests(this.userId).then((res) => {
    const result = res as Array<ResearchRequestVM>;
  
    this.listToView = result;

    if(this.startDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

    if(this.endDate)
      this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

    this.spinner.hide();
    $('#researchLibraryDT').DataTable().destroy();
    setTimeout(() => {
      $('#researchLibraryDT').DataTable({
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
    this.getResearchlistToView();
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.getResearchlistToView();
  }

  exportExcel() {
    let listToExport = new Array<any>();
    this.listToView.map(r => listToExport.push({'responsibleName': r.responsibleName, 'requestStatus': this.getRequestStatusById(r.requestStatusId), 'createdDate': r.createdDate}));
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
      const headers: any = { responsibleName: 'إسم السؤول عن الطلب', requestStatus: 'حالة الطلب' , createdDate: 'تاريخ الطلب'};
      listToExport.unshift(headers);
      worksheet = XLSX.utils.json_to_sheet(listToExport, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(listToExport);
    }
    const workbook = XLSX.utils.book_new();
    const fileName =  'طلب خلوة بحثية أو مادة علمية' + "_export_" + new Date().getTime() + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);  
  }

  archiveConfirmation(researchRequest: ResearchRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to add to archive ?"
                                                                                : "هل أنت متأكد ، تريد الإضافة إلى الأرشيف ؟");
    this.confirmationModalService.model = researchRequest;
    this.confirmationModalService.confirmAction = this.ResearchRequestService.addToArchivedAndUpdateResearchRequest;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(ResearchRequest: ResearchRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = ResearchRequest;
    this.confirmationModalService.confirmAction = this.ResearchRequestService.deleteResearchRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
