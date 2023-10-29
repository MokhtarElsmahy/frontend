import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { ResearchRequestVM } from 'src/app/shared/models/VM/businessServices/ResearchRequestVM';
import { ResearchRequestService } from 'src/app/shared/services/businessServices/researchRequest.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-research-retreat-archived',
  templateUrl: './research-retreat-archived.component.html',
  styleUrls: ['./research-retreat-archived.component.scss']
})
export class ResearchRetreatArchivedComponent implements OnInit {

  userId: string;
  // dtOptions: DataTables.Settings = {};
  // pageNumber: number = 1;
  // pageSize: number = 10;
  listToView: Array<ResearchRequestVM>;
  requestsCount: number;
  requestStatusesList: CommonVM[];

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(public translate: TranslateService,
    public router: Router,
    public researchRequestService: ResearchRequestService,
    public CommonService: CommonService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getArchivedResearchRequestsList(this.userId);
    this.getRequestStatusesList();
  }

  getArchivedResearchRequestsList(userId: string) {
    this.spinner.show();
    this.researchRequestService.getArchivedResearchRequestsList(userId).then((res) => {
    const result = res as Array<ResearchRequestVM>;
  
    this.listToView = result;
    this.spinner.hide();
    this.requestsCount=this.listToView.length;
    setTimeout(() => {
      $('#researchRequestDT').DataTable({
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

  unArchiveConfirmation(researchRequest: ResearchRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to restore from archive ?"
                                                                                : "هل أنت متأكد ، تريد الإستعادة من الأرشيف ؟");
    this.confirmationModalService.model = researchRequest;
    this.confirmationModalService.confirmAction = this.researchRequestService.unArchiveAndUpdateResearchRequest;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(researchRequest: ResearchRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = 'delete';
    this.confirmationModalService.model = researchRequest;
    this.confirmationModalService.confirmAction = this.researchRequestService.deleteResearchRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
