import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LibraryService } from 'src/app/shared/services/basicData/library.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
import { GiftRequestReplyVM } from 'src/app/shared/models/VM/businessServices/GiftRequestReplyVM';

@Component({
  selector: 'app-book-gift-follow',
  templateUrl: './book-gift-follow.component.html',
  styleUrls: ['./book-gift-follow.component.scss']
})
export class BookGiftFollowComponent {
  currentRate = 4;
  userId;
  giftRequestId;
  giftRequest: GiftRequestVM = new GiftRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;
  giftTypesList: CommonVM[];
  requestStatusesList: CommonVM[];
  //repliesList: GiftRequestReplyVM[];

  requestComment: string;
  serviceRating: ServiceRatingVM;
  repliesList: GiftRequestReplyVM[];

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum; 
  }
  
  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    public router: Router,
    public CommonService: CommonService,
    public GiftRequestService: GiftRequestService,
    public serviceRatingService: ServiceRatingService,
    public LibraryService: LibraryService,
    public confirmationModalService: ConfirmationModalService,
    public appointmentService: AppointmentService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { 
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.giftRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getRequestStatusesList();
      this.getGiftRequestById(this.giftRequestId, this.userId);
      this.getGiftTypes();
    }
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

  getGiftRequestById(giftRequestId: number, userId: string){
    this.spinner.show();
    this.GiftRequestService.getGiftRequestById(giftRequestId, userId).then((res) => {
      const result = res as GiftRequestVM;
      this.giftRequest = result;
      
      this.getRequestReplies();
      this.getServiceRatingByUserId();
      this.spinner.hide();
    });
  }

  getGiftTypes() {
    this.CommonService.GetCommonsByDomain('GiftType').then((res) => {
      const result = res as Array<CommonVM>;

      this.giftTypesList = result;
    });
  }

  getGiftTypeById(id: number){
    let giftType = this.giftTypesList.find(t => t.id == id);

    return this.translate.currentLang == 'en' ? giftType.value : giftType.valueArabic;
  }

  getRequestReplies(){
    this.spinner.show();
    this.GiftRequestService.getAllGiftRequestReplies(this.giftRequestId).then((res) => {
      let result = res as Array<GiftRequestReplyVM>;

      this.repliesList = result;
      this.spinner.hide();
    });
  }

  isMyReply(reply: GiftRequestReplyVM){
    if(reply.createdBy == this.userId){
      return true;
    }
    else{
      return false;
    }
  }

  updateRequestWithReply(f: NgForm){
    if(f.valid){
      if(this.requestComment != ''){
        let requestReply = new GiftRequestReplyVM();
        requestReply.giftRequestId = this.giftRequestId;
        requestReply.createdBy = this.userId;
        requestReply.userName = this.giftRequest.supplierName;
        requestReply.userMessage = this.requestComment;

        this.spinner.show();
        this.global.Messages = [];
        this.GiftRequestService.createNewGiftRequestReply(requestReply).then()
        .finally(() => {
          if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
            f.resetForm();
            this.getRequestReplies();
            this.spinner.hide();
          }     
        });
      }
    }
  }
  
  getServiceRatingByUserId() {
    this.serviceRatingService.getServiceRatingByUserId(this.userId, 7).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if(!result){
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }
  
  createOrUpdateServiceRating(){
    this.spinner.show();
    if(this.serviceRating.rate > 0){
      if(this.serviceRating.id){
        this.serviceRating.updatedBy = this.userId;
      }
      else{
        this.serviceRating.serviceType = 7;
        this.serviceRating.requestId = this.giftRequest.id;
        this.serviceRating.userId = this.userId;
        this.serviceRating.createdBy = this.userId;
      }
      this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
      .finally(() => {
        this.spinner.hide();
      });
    }
  }
}
