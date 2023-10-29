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
import { MainClassificationVM, SelectiveBroadcastItemVm, SelectiveBroadcastVm, SubClassificationVM } from 'src/app/shared/models/VM/businessServices/SelectiveBroadcastVm';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrls: ['./subscribe-form.component.scss']
})
export class SubscribeFormComponent implements OnInit {

  RequestId;
  userId: string
  MainList: Array<MainClassificationVM>
  SubList: Array<SubClassificationVM>

  SelectiveBroadcastItemVm: SelectiveBroadcastItemVm = new SelectiveBroadcastItemVm()

  MainId: number;
  SubId: number;
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
    this.SelectiveBroadcastItemVm = new SelectiveBroadcastItemVm()
    this.GetAllMainClassification();
  }

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
  GetAllMainClassification() {
    this.spinner.show();
    this.SubscribeService.GetMainCalssifications().then((res) => {
      const result = res as Array<MainClassificationVM>
      this.MainList = result
      this.spinner.hide();
    });
  }
  getSubClassificationByMainId(MainId: number) {
    if (MainId > 0) {

      this.MainValid = true
    }
    else {
      this.MainValid = false
      return
    }
    this.spinner.show();
    this.SubscribeService.GetSubCalssifications(MainId).then((res) => {
      const result = res as Array<SubClassificationVM>;
      this.SubList = result
      this.spinner.hide();
    });
  }

  SubValid = true
  MainValid = true
  SaveAdd() {


    if (this.MainId < 0 || !this.MainId) {
      this.MainValid = false
    }
    if (this.SubId < 0 || !this.SubId) {
      this.SubValid = false
    }

    if (this.MainId && this.SubId && this.MainId > 0 && this.SubId > 0) {


      if (this.SubscribeService?.SelectiveBroadcastVm?.selectivebroadcastItems.filter(c => c.mainId == this.MainId && c.subId == this.SubId)?.length>0) {
        return;
      }

      this.SelectiveBroadcastItemVm.mainClassification = new MainClassificationVM();
      this.SelectiveBroadcastItemVm.subClassification = new SubClassificationVM();
      this.SelectiveBroadcastItemVm.mainId = this.MainId
      this.SelectiveBroadcastItemVm.subId = this.SubId
      this.SelectiveBroadcastItemVm.mainClassification.name = this.MainList.filter(c => c.id == this.MainId)[0].name
      this.SelectiveBroadcastItemVm.mainClassification.id = this.MainId

      this.SelectiveBroadcastItemVm.subClassification.name = this.SubList.filter(c => c.id == this.SubId)[0].name
      this.SelectiveBroadcastItemVm.subClassification.id = this.SubId
      this.SelectiveBroadcastItemVm.subClassification.mainClassificationId = this.MainId
      this.SelectiveBroadcastItemVm.requestId = this.SubscribeService?.SelectiveBroadcastVm?.id;
      this.SelectiveBroadcastItemVm.statusId = RequestStatusEnum.Pending;

      let ob = Object.assign({}, this.SelectiveBroadcastItemVm);


      this.SubscribeService?.SelectiveBroadcastVm?.selectivebroadcastItems.push(ob)
    }


  }

  Save() {
    this.SaveAdd();
    this.closeModal();
  }

  closeModal() {
    this.activeModal.dismiss('Cross click')

  }
  ValidateSubList(subId) {
    if (subId > 0) {

      this.SubValid = true
    }
    else {
      this.SubValid = false
      return
    }
  }
}
