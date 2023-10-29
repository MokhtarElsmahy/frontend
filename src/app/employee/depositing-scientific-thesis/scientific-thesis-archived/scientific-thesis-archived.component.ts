import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { ThesisDepositionRequestVM } from 'src/app/shared/models/VM/businessServices/ThesisDepositionRequestVM';
import { ThesisDepositionRequestService } from 'src/app/shared/services/businessServices/thesisDepositionRequest.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-scientific-thesis-archived',
  templateUrl: './scientific-thesis-archived.component.html',
  styleUrls: ['./scientific-thesis-archived.component.scss']
})
export class ScientificThesisArchivedComponent implements OnInit {

  userId: string;
  listToView: Array<ThesisDepositionRequestVM>;
  requestsCount: number;
  requestStatusesList: CommonVM[];
  isOutsideKingdom :boolean =false
  constructor(public translate: TranslateService,
    public router: Router,
    public thesisDepositionRequestService: ThesisDepositionRequestService,
    public CommonService: CommonService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getArchivedThesisDepositionRequestsList(this.userId);
    this.getRequestStatusesList();
  }

  getArchivedThesisDepositionRequestsList(userId: string) {
    this.spinner.show();
    this.thesisDepositionRequestService.getArchivedThesisDepositionRequestsList(userId,this.isOutsideKingdom).then((res) => {
    const result = res as Array<ThesisDepositionRequestVM>;
  
    this.listToView = result;
    this.spinner.hide();
    this.requestsCount=this.listToView.length;
    $('#thesisDepositionRequestDT').DataTable().destroy();
    setTimeout(() => {
      $('#thesisDepositionRequestDT').DataTable({
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

  unArchiveConfirmation(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to restore from archive ?"
                                                                                : "هل أنت متأكد ، تريد الإستعادة من الأرشيف ؟");
    this.confirmationModalService.model = thesisDepositionRequest;
    this.confirmationModalService.confirmAction = this.thesisDepositionRequestService.unArchiveAndUpdateThesisDepositionRequest;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(thesisDepositionRequest: ThesisDepositionRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = 'delete';
    this.confirmationModalService.model = thesisDepositionRequest;
    this.confirmationModalService.confirmAction = this.thesisDepositionRequestService.deleteThesisDepositionRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }

  getSource(){
    this.spinner.show();
    this.thesisDepositionRequestService.getArchivedThesisDepositionRequestsList(this.userId,this.isOutsideKingdom).then((res) => {
    const result = res as Array<ThesisDepositionRequestVM>;
  
    this.listToView = result;
    this.spinner.hide();
    this.requestsCount=this.listToView.length;
    $('#thesisDepositionRequestDT').DataTable().destroy();
    setTimeout(() => {
      $('#thesisDepositionRequestDT').DataTable({
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
