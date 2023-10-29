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
import { SubscribeRequestService } from 'src/app/shared/services/businessServices/subscribe-request.service';
import { EmpSelectiveBroadcastItem, SelectiveBroadcastVm } from 'src/app/shared/models/VM/businessServices/SelectiveBroadcastVm';

@Component({
  selector: 'app-subscribe-list',
  templateUrl: './subscribe-list.component.html',
  styleUrls: ['./subscribe-list.component.scss']
})
export class SubscribeListComponent implements OnInit {

  userId: string
  listToView: Array<EmpSelectiveBroadcastItem>;
  constructor(public translate: TranslateService,
    public router: Router,
    private modalService: NgbModal,
    public CommonService: CommonService,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService,
    public subscribeService  : SubscribeRequestService ,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.GetAllRequests();
  }


  GetAllRequests() {
    this.spinner.show();
    this.subscribeService.getAllRequests(this.userId).then(
      (res) => {

        const result = res as Array<EmpSelectiveBroadcastItem>
        //console.log(result)
        this.listToView = result
       

        this.spinner.hide();
        $('#askLibrarianDT').DataTable().clear().draw();
        $('#askLibrarianDT').DataTable().destroy();
        setTimeout(() => {
          $('#askLibrarianDT').DataTable({
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
