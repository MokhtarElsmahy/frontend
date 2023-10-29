import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { InquiryService } from 'src/app/shared/services/businessServices/inquiry.service';
import { VisitRequestService } from 'src/app/shared/services/businessServices/visitRequest.service';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { ThesisDepositionRequestService } from 'src/app/shared/services/businessServices/thesisDepositionRequest.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { VisitRequestVM } from 'src/app/shared/models/VM/businessServices/VisitRequestVM';
import { InquiryVM } from 'src/app/shared/models/VM/businessServices/InquiryVM';
import { ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { ThesisDepositionRequestVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestVM';
import { UserService } from 'src/app/shared/services/user.service';
import { MyRequestModel } from 'src/app/shared/models/VM/MyRequestModel';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
import { GiftBookRequestService } from 'src/app/shared/services/businessServices/gift-book-request.service';
import { LibraryExchangeRequestService } from 'src/app/shared/services/businessServices/library-exchange-request.service';
import { ManuscriptRequestService } from 'src/app/shared/services/businessServices/manuscript-request.service';
import { CopyRequestService } from 'src/app/shared/services/businessServices/copy-request.service';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { GiftBackRequestVM } from 'src/app/shared/models/VM/businessServices/GiftBackRequestVM';
import { LibraryExchangeRequestVM } from 'src/app/shared/models/VM/businessServices/LibraryExchangRequestVM';
import { ManuscriptVM } from 'src/app/shared/models/VM/businessServices/ManuscriptVM';
import { CopyRequestVM } from 'src/app/shared/models/VM/businessServices/CopyRequestVM';
import { SubscribeRequestService } from 'src/app/shared/services/businessServices/subscribe-request.service';
import { SelectiveBroadcastVm } from 'src/app/shared/models/VM/businessServices/SelectiveBroadcastVm';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})

export class MyOrdersComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  userId;
  listToView: Array<any> = new Array<any>();
  pageNumber: number = 1;
  pageSize: number = 10;
  requestsCount: number;
  suggestionsList: Array<any> = new Array<any>();
  inquiriesList: Array<any> = new Array<any>();
  visitRequestsList: Array<any> = new Array<any>();
  researchRequestsList: Array<any> = new Array<any>();
  thesisDepositionRequestsList: Array<any> = new Array<any>();
  
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  minDatePicker: { year: number; month: number; day: number; };
  requestType: number = 0;
  requestStatus: string = "All";
  isRandomSelectMode: boolean;
  randomlySelectedList: Array<any> = new Array<any>();

  constructor(public translate: TranslateService,
    public router: Router,
    public global: GlobalService,
    public userService: UserService,
    public suggestionService: SuggestionService,
    public inquiryService: InquiryService,
    public visitRequestService: VisitRequestService,
    public researchRequestService: ResearchRequestService,
    public thesisDepositionRequestService: ThesisDepositionRequestService,
    public giftRequestService: GiftRequestService,
    public giftBackRequestService: GiftBookRequestService,
    public libraryExchangeRequestService: LibraryExchangeRequestService,
    public manuscriptRequestService: ManuscriptRequestService,
    public copyRequestService: CopyRequestService,
    public selectiveBroadcastRequestService: SubscribeRequestService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.pageSize
    }
    this.userId = this.global.getCurrentUserId();
    this.collectMyRequests();
  }

  collectMyRequests(){
    this.getAllUserRequests();
  }

  getAllUserRequests(){
    this.spinner.show();
    this.userService.getUserRequestsList(this.userId).then((res) => {
      const result = res as Array<MyRequestModel>;

      this.listToView = result;  
      
      if(this.requestType && this.requestType != 0)
        this.listToView = this.listToView.filter(r => r.code == this.requestType);

      if(this.requestStatus && this.requestStatus != 'All')
        this.listToView = this.listToView.filter(r => r.statusEn == this.requestStatus);

      if(this.startDate)
        this.listToView = this.listToView.filter(r => new Date(r.date) >= new Date(this.startDate));

      if(this.endDate)
        this.listToView = this.listToView.filter(r => new Date(r.date) <= new Date(this.endDate));

      this.spinner.hide();
      $('#myOrdersDT').DataTable().destroy();
      setTimeout(() => {
        $('#myOrdersDT').DataTable({
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
    this.getAllUserRequests();
  }

  setEndDate(date: NgbDate) {
    this.endDate = date.year +'-'+ (date.month > 9 ? date.month : '0' + date.month) +'-'+ (date.day > 9 ? date.day : '0' + date.day);
    this.getAllUserRequests();
  }

  setSelectedRaw(requestCode, requestId, eventTarget){
    let selectedElement = this.listToView.find(r => r.code == requestCode && r.id == requestId);
    if(eventTarget.checked){
      this.isRandomSelectMode = true;
      this.randomlySelectedList.push(selectedElement);
    }
    else{
      let elementIndex = this.randomlySelectedList.findIndex(r => r.code == selectedElement.code && r.id == selectedElement.id);
      this.randomlySelectedList.splice(elementIndex, 1);
      
      if(this.randomlySelectedList.length == 0){
        this.isRandomSelectMode = false;
      }
    }
  }

  clearFilters(){
    this.requestType = 0;
    this.requestStatus = 'All';
    this.startDatePicker = null;
    this.startDate = null;
    this.endDatePicker = null;
    this.endDate = null;
    this.minDatePicker = null;
    this.getAllUserRequests();
  }

  exportExcel() {
    let listToExport = new Array<any>();
    if(this.isRandomSelectMode){
      this.randomlySelectedList.map(r => listToExport.push({'requestName': this.translate.currentLang == 'en' ? r.requestNameEn : r.requestNameAr, 'requestStatus': this.translate.currentLang == 'en' ? r.statusEn : r.statusAr, 'createdDate': r.date}));
    }
    else{
      this.listToView.map(r => listToExport.push({'requestName': this.translate.currentLang == 'en' ? r.requestNameEn : r.requestNameAr, 'requestStatus': this.translate.currentLang == 'en' ? r.statusEn : r.statusAr, 'createdDate': r.date}));
    }

    if(this.startDate){
      listToExport = listToExport.filter(r => new Date(r.date.toString().split('T')[0]) >= new Date(this.startDate));
    }
    if(this.endDate){
      listToExport = listToExport.filter(r => new Date(r.date.toString().split('T')[0]) <= new Date(this.endDate));
    }

    let EXCEL_EXTENSION = '.xlsx';
    let worksheet: XLSX.WorkSheet;
    let customHeader = true;
    let sheetName = 'My Sheet 1';
    if (customHeader) {
      const headers: any = { requestName: 'إسم الطلب', requestStatus: 'حالة الطلب' , createdDate: 'تاريخ الطلب'};
      listToExport.unshift(headers);
      worksheet = XLSX.utils.json_to_sheet(listToExport, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(listToExport);
    }
    const workbook = XLSX.utils.book_new();
    const fileName =  'طلباتي' + "_export_" + new Date().getTime() + EXCEL_EXTENSION;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);  
  }

  // getSuggestions(){
  //   this.suggestionService.getSuggestionsList(this.userId).then((res) => {
  //     const result = res as Array<SuggestionVM>;

  //     result.map(x=> {
  //       this.suggestionsList.push({'id' : x.id, 'type': 'Suggestion', 'requestNameAr': 'إقتراح شراء كتاب', 'requestNameEn': 'Buy book suggestion', 'date': x.createdDate, 'status': this.translate.currentLang == 'en' ? 'Submitted' : 'تم الإرسال'});
  //     });
      
  //     this.suggestionsList.forEach(s => {
  //       this.listToView.push(s);
  //     });
  //   });
  // }
  
  // getInquiries(){
  //   this.inquiryService.getInquiriesList(this.userId).then((res) => {
  //     const result = res as Array<InquiryVM>;

  //     result.map(x=> {
  //       this.inquiriesList.push({'id' : x.id, 'type': 'Inquiry', 'requestNameAr': 'إسأل موظف المكتبة', 'requestNameEn': 'Ask library employee', 'date': x.createdDate,'status': x.response == null ? (this.translate.currentLang == 'en' ? 'Pending' : 'قيد المراجعة') : (this.translate.currentLang == 'en' ? 'Responded' : 'تم الرد'), 'isEditable': x.response == null ? true : false});
  //     });
      
  //     this.inquiriesList.forEach(s => {
  //       this.listToView.push(s);
  //     });
  //   });
  // }

  // getVisitRequests(){
  //   this.visitRequestService.getAllVisitRequests(this.userId).then((res) => {
  //     const result = res as Array<VisitRequestVM>;

  //     result.map(x=> {
  //       this.visitRequestsList.push({'id' : x.id, 'type': 'VisitRequest', 'requestNameAr': 'طلب زيارة مكتبة', 'requestNameEn': 'Visit library request', 'date': x.createdDate, 'status': x.requestStatusId == 4 ? (this.translate.currentLang == 'en' ? 'Pending' : 'قيد المراجعة') : (x.requestStatusId == 5 ? (this.translate.currentLang == 'en' ? 'Approved' : 'تم الموافقة') : (this.translate.currentLang == 'en' ? 'Rejected' : 'تم الرفض')), 'isEditable': x.requestStatusId == 4 ? true : false});
  //     });

  //     this.visitRequestsList.forEach(s => {
  //       this.listToView.push(s);
  //     });
  //   });
  // }

  // getResearchRequests(){
  //   this.researchRequestService.getAllResearchRequests(this.userId).then((res) => {
  //     const result = res as Array<ResearchRequestVM>;

  //     result.map(x=> {
  //       this.researchRequestsList.push({'id' : x.id, 'type': 'ResearchRequest', 'requestNameAr': 'طلب خلوة بحثية و مادة علمية', 'requestNameEn': 'Research request', 'date': x.createdDate, 'status': x.requestStatusId == 4 ? (this.translate.currentLang == 'en' ? 'Pending' : 'قيد المراجعة') : (x.requestStatusId == 5 ? (this.translate.currentLang == 'en' ? 'Approved' : 'تم الموافقة') : (this.translate.currentLang == 'en' ? 'Rejected' : 'تم الرفض')), 'isEditable': x.requestStatusId == 4 ? true : false});
  //     });
      
  //     this.researchRequestsList.forEach(s => {
  //       this.listToView.push(s);
  //     });
  //   });
  // }

  // getThesisDepositionRequests(){
  //   this.thesisDepositionRequestService.getAllThesisDepositionRequests(this.userId).then((res) => {
  //     const result = res as Array<ThesisDepositionRequestVM>;

  //     result.map(x=> {
  //       this.thesisDepositionRequestsList.push({'id' : x.id, 'type': 'ThesisDepositionRequest', 'requestNameAr': 'طلب إيداع رسالة علمية', 'requestNameEn': 'Thesis deposition request', 'date': x.createdDate, 'status': x.requestStatusId == 4 ? (this.translate.currentLang == 'en' ? 'Pending' : 'قيد المراجعة') : (x.requestStatusId == 5 ? (this.translate.currentLang == 'en' ? 'Approved' : 'تم الموافقة') : (this.translate.currentLang == 'en' ? 'Rejected' : 'تم الرفض')), 'isEditable': x.requestStatusId == 4 ? true : false});
  //     });

  //     this.thesisDepositionRequestsList.forEach(s => {
  //       this.listToView.push(s);
  //     });
  //   });
  // }

  editRequest(request){
    switch(request.type){
      case 'Suggestion':
        this.router.navigateByUrl("/auth/user/buy-book-form/edit-suggestion/"+request.id);
        break;
      case 'Inquiry':
        this.router.navigateByUrl("/auth/user/ask-librarian-form/edit-inquiry/"+request.id);
        break;
      case 'VisitRequest':
        this.router.navigateByUrl("/auth/user/visit-library-form/edit-visitRequest/"+request.id);
        break;
      case 'ResearchRequest':
        this.router.navigateByUrl("/auth/user/research-retreat-form/edit-researchRequest/"+request.id);
        break;
      case 'ThesisDepositionRequest':
        this.router.navigateByUrl("/auth/user/scientific-thesis-form/edit-thesisDepositionRequest/"+request.id);
        break;
      case 'GiftRequest':
        this.router.navigateByUrl("/auth/user/book-gift-form/edit-giftRequest/"+request.id);
        break;
      case 'GiftBackRequest':
        this.router.navigateByUrl("/auth/user/request-gift-form/edit-requestgift/"+request.id);
        break;
      case 'LibraryExchangeRequest':
        this.router.navigateByUrl("/auth/user/libraries-exchange-form/edit/"+request.id);
        break;
      case 'ManuscriptRequest':
        this.router.navigateByUrl("/auth/user/manuscript-request-form/edit-manuscript-request/"+request.id);
        break;
      case 'CopyRequest':
        this.router.navigateByUrl("/auth/user/copy-book-form/edit/"+request.id);
        break;
    }
  }

  followRequest(request){
    switch(request.type){
      case 'Inquiry':
        this.router.navigateByUrl("/auth/user/ask-librarian-form/edit-inquiry/"+request.id);
        break;
      case 'VisitRequest':
        this.router.navigateByUrl("/auth/user/visit-library-follow/follow-visitRequest/"+request.id);
        break;
      case 'ResearchRequest':
        this.router.navigateByUrl("/auth/user/research-retreat-follow/follow-researchRequest/"+request.id);
        break;
      case 'ThesisDepositionRequest':
        this.router.navigateByUrl("/auth/user/scientific-thesis-follow/follow-thesisDepositionRequest/"+request.id);
        break;
        case 'GiftRequest':
        this.router.navigateByUrl("/auth/user/book-gift-follow/follow-giftRequest/"+request.id);
        break;
      case 'GiftBackRequest':
        this.router.navigateByUrl("/auth/user/request-gift-form/request-giftfollow/"+request.id);
        break;
      case 'LibraryExchangeRequest':
        this.router.navigateByUrl("/auth/user/libraries-exchange-follow/"+request.id);
        break;
      case 'ManuscriptRequest':
        this.router.navigateByUrl("/auth/user/manuscript-request-follow/"+request.id);
        break;
      case 'CopyRequest':
        this.router.navigateByUrl("/auth/user/copy-book-follow/"+request.id);
        break;
      case 'SelectiveBroadcastRequest':
        this.router.navigateByUrl("/auth/user/subscribe-list/"+request.id);
        break;
    }
  }

  deleteConfirmation(request: any){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    switch (request.type) {
      case 'Suggestion':
        this.suggestionService.getSuggestionById(request.id, this.userId).then((res) => {
          let result = res as SuggestionVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.suggestionService.addToArchivedAndUpdateSuggestion;
        break;
      case 'Inquiry':
        this.inquiryService.getInquiryById(request.id, this.userId).then((res) => {
          let result = res as InquiryVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.inquiryService.addToArchivedAndUpdateInquiry;
        break;
      case 'VisitRequest':
        this.visitRequestService.getVisitRequestById(request.id, this.userId).then((res) => {
          let result = res as VisitRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.visitRequestService.addToArchivedAndUpdateVisitRequest;
        break;
      case 'ResearchRequest':
        this.researchRequestService.getResearchRequestById(request.id, this.userId).then((res) => {
          let result = res as ResearchRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.researchRequestService.addToArchivedAndUpdateResearchRequest;
        break;
      case 'ThesisDepositionRequest':
        this.thesisDepositionRequestService.getThesisDepositionRequestById(request.id, this.userId).then((res) => {
          let result = res as ThesisDepositionRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.researchRequestService.addToArchivedAndUpdateResearchRequest;
        break;
      case 'GiftRequest':
        this.giftRequestService.getGiftRequestById(request.id, this.userId).then((res) => {
          let result = res as GiftRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.giftRequestService.addToArchivedAndUpdateGiftRequest;
        break;
      case 'GiftBackRequest':
        this.giftBackRequestService.getRequestById(request.id, this.userId).then((res) => {
          let result = res as GiftBackRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.giftBackRequestService.addToArchivedAndUpdateGiftBookRequest;
        break;
      case 'LibraryExchangeRequest':
        this.libraryExchangeRequestService.getRequestById(request.id, this.userId).then((res) => {
          let result = res as LibraryExchangeRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.libraryExchangeRequestService.addToArchivedAndUpdateGiftBookRequest;
        break;
      case 'ManuscriptRequest':
        this.manuscriptRequestService.getManuscriptRequestById(request.id, this.userId).then((res) => {
          let result = res as ManuscriptVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.manuscriptRequestService.Archive;
        break;
      case 'CopyRequest':
        this.copyRequestService.getCopyRequestById(request.id, this.userId).then((res) => {
          let result = res as CopyRequestVM;
          this.confirmationModalService.model = result;
        });
        this.confirmationModalService.confirmAction = this.copyRequestService.Archive;
        break;
    }
    this.confirmationModalService.caller = this;
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
