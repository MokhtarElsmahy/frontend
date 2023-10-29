import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';

import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribeRequestService } from 'src/app/shared/services/businessServices/subscribe-request.service';
import { SelectiveBroadcastVm } from 'src/app/shared/models/VM/businessServices/SelectiveBroadcastVm';

@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrls: ['./subscribe-form.component.scss']
})
export class SubscribeFormComponent implements OnInit{
  RequestId;
  userId: string
  SelectiveBroadcastVm : SelectiveBroadcastVm
  constructor(public activeModal: NgbActiveModal,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService,
    public SubscribeService: SubscribeRequestService

  ) { }


  ngOnInit(): void {
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.userId = this.global.getCurrentUserId();
      this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestById(this.RequestId, this.userId);
      

   
    }
  }

  getRequestById(giftRequestId: number, userId: string) {
    this.spinner.show();
    this.SubscribeService.getRequestById(giftRequestId, userId).then((res) => {
      const result = res as SelectiveBroadcastVm;
      this.SelectiveBroadcastVm = result
      this.spinner.hide();
    });
  }

}
