import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GiftBackRequestVM } from 'src/app/shared/models/VM/businessServices/GiftBackRequestVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { GiftBookRequestService } from 'src/app/shared/services/businessServices/gift-book-request.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-request-gift-archived',
  templateUrl: './request-gift-archived.component.html',
  styleUrls: ['./request-gift-archived.component.scss']
})
export class RequestGiftArchivedComponent  implements OnInit {
  userId: string
  listToView: Array<GiftBackRequestVM>;
  startDatePicker: NgbDateStruct;
  endDatePicker: NgbDateStruct;
  startDate: string = null;
  endDate: string = null;
  requestStatusesList: CommonVM[];
  minDatePicker: { year: number; month: number; day: number; };
  constructor(public translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    public CommonService: CommonService,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService,
    public GiftRequestService: GiftBookRequestService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.GetArchivedGiftBackRequests()
    this.getRequestStatusesList();
  }



  getRequestStatusesList() {
    this.CommonService.GetCommonsByDomain("RequestStatus").then((res) => {
      const result = res as Array<CommonVM>;

      this.requestStatusesList = result;
    });
  }

  getRequestStatusById(requestStatusId: number) {
    let status = this.requestStatusesList.find(s => s.id == requestStatusId);

    return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
  }

  archiveConfirmation(GiftBackRequestVM: GiftBackRequestVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to remove from archive ?"
                                                                                : "هل أنت متأكد ، تريد الحذف من الأرشيف ؟");
    this.confirmationModalService.model = GiftBackRequestVM;
    this.confirmationModalService.confirmAction = this.GiftRequestService.UnArchivedAndUpdateGiftBookRequest;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }

  GetArchivedGiftBackRequests() {
    this.spinner.show();
    this.GiftRequestService.GetArchivedGiftBackRequests(this.userId).then(
      (res) => {

        const result = res as Array<GiftBackRequestVM>
        // console.log(result)
        this.listToView = result
        if (this.startDate)
          this.listToView = this.listToView.filter(r => new Date(r.createdDate) >= new Date(this.startDate));

        if (this.endDate)
          this.listToView = this.listToView.filter(r => new Date(r.createdDate) <= new Date(this.endDate));

        this.spinner.hide();
        $('#bookgift').DataTable().destroy();
        setTimeout(() => {
          $('#bookgift').DataTable({
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
}
