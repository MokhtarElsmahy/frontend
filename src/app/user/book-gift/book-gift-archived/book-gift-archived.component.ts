import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
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
  selector: 'app-book-gift-archived',
  templateUrl: './book-gift-archived.component.html',
  styleUrls: ['./book-gift-archived.component.scss']
})
export class BookGiftArchivedComponent implements OnInit {

  userId: string;
  listToView: Array<GiftRequestVM>;
  requestsCount: number;
  requestStatusesList: CommonVM[];

  constructor(public translate: TranslateService,
    public router: Router,
    public giftRequestService: GiftRequestService,
    public CommonService: CommonService,
    public global: GlobalService,
    private modalService: NgbModal,
    public confirmationModalService: ConfirmationModalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getArchivedGiftRequestsList(this.userId);
    this.getRequestStatusesList();
  }

  getArchivedGiftRequestsList(userId: string) {
    this.spinner.show();
    this.giftRequestService.getArchivedGiftRequestsList(userId).then((res) => {
    const result = res as Array<GiftRequestVM>;
  
    this.listToView = result;
    this.spinner.hide();
    this.requestsCount=this.listToView.length;
    setTimeout(() => {
      $('#giftRequestDT').DataTable({
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

  unArchiveConfirmation(giftRequest: GiftRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to restore from archive ?"
                                                                                : "هل أنت متأكد ، تريد الإستعادة من الأرشيف ؟");
    this.confirmationModalService.model = giftRequest;
    this.confirmationModalService.confirmAction = this.giftRequestService.unArchiveAndUpdateGiftRequest;
    this.confirmationModalService.caller = this;
  }

  deleteConfirmation(giftRequest: GiftRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = 'delete';
    this.confirmationModalService.model = giftRequest;
    this.confirmationModalService.confirmAction = this.giftRequestService.deleteGiftRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
