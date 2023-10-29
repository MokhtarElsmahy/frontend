import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import * as XLSX from 'xlsx';
import { CopyRequestVM } from 'src/app/shared/models/VM/businessServices/CopyRequestVM';
import { CopyRequestService } from 'src/app/shared/services/businessServices/copy-request.service';

@Component({
  selector: 'app-copy-book-view',
  templateUrl: './copy-book-view.component.html',
  styleUrls: ['./copy-book-view.component.scss']
})
export class CopyBookViewComponent  implements OnInit{

  userId: string
  listToView: Array<CopyRequestVM>;
  requestStatusesList: CommonVM[];
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  IsOutsideKingdom =false;
  minDatePicker: { year: number; month: number; day: number; };

  constructor(public translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    public CommonService: CommonService,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService,
    public CopyRequestService : CopyRequestService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {


    this.userId = this.global.getCurrentUserId();
    this. getRequestStatusesList();
    this.GetAllCopyRequests()


  }

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
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

  GetAllCopyRequests() {
    this.spinner.show();
    this.CopyRequestService.getAllCopyRequests(this.userId,this.IsOutsideKingdom).then(
      (res) => {

        const result = res as Array<CopyRequestVM>
        // console.log(result)
        this.listToView = result
        if (this.startDate)
          this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

        if (this.endDate)
          this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

        this.spinner.hide();
        $('#bookcopy').DataTable().clear().draw();
        $('#bookcopy').DataTable().destroy();
        setTimeout(() => {
          $('#bookcopy').DataTable({
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

  setStartDate(date: NgbDate) {
    this.startDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.minDatePicker = date;
    this.GetAllCopyRequests();
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.GetAllCopyRequests();
  }

  archiveConfirmation(CopyRequestVM: CopyRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to add to archive ?"
                                                                                : "هل أنت متأكد ، تريد الإضافة إلى الأرشيف .؟");
    this.confirmationModalService.model = CopyRequestVM;
    this.confirmationModalService.confirmAction = this.CopyRequestService.Archive;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }


  exportExcel() {
    let listToExport = new Array<any>();
    this.listToView.map(r => listToExport.push({'Name': r.beneficiaryName, 'requestStatus': this.getRequestStatusById(r.requestStatusId), 'createdDate': r.createdDate}));
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
      const headers: any = { Name: 'المسئول', requestStatus: 'حالة الطلب' , createdDate: 'تاريخ الطلب'};
      listToExport.unshift(headers);
      worksheet = XLSX.utils.json_to_sheet(listToExport, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(listToExport);
    }
    const workbook = XLSX.utils.book_new();
    const fileName =  'طلب تصوير كتاب ' + "_export_" + new Date().getTime() + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);  
  }
}
