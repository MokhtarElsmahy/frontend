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
import { ManuscriptVM } from 'src/app/shared/models/VM/businessServices/ManuscriptVM';
import { ManuscriptRequestService } from 'src/app/shared/services/businessServices/manuscript-request.service';

@Component({
  selector: 'app-manuscript-request-archived',
  templateUrl: './manuscript-request-archived.component.html',
  styleUrls: ['./manuscript-request-archived.component.scss']
})
export class ManuscriptRequestArchivedComponent implements OnInit {
  userId: string
  listToView: Array<ManuscriptVM>;
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
    public manuscriptService: ManuscriptRequestService,
    private spinner: NgxSpinnerService) { }
  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.GetArchivedManuscriptRequests()
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

  archiveConfirmation(ManuscriptVM: ManuscriptVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.message = (this.translate.currentLang == 'en' ? "Are you sure, you want to remove from archive ?"
                                                                                : "هل أنت متأكد ، تريد الحذف من الأرشيف ؟");
    this.confirmationModalService.model = ManuscriptVM;
    this.confirmationModalService.confirmAction = this.manuscriptService.Unarchive;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }

  GetArchivedManuscriptRequests() {
    this.spinner.show();
    this.manuscriptService.getArchivedManuscriptRequests(this.userId).then(
      (res) => {

        const result = res as Array<ManuscriptVM>
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
