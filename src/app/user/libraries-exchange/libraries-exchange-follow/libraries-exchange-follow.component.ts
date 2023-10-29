import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { GiftBackBookVM } from 'src/app/shared/models/VM/businessServices/GiftBackBookVM';
import { GiftBackCommentVM } from 'src/app/shared/models/VM/businessServices/GiftBackCommentVM';
import { LibraryExchangeBookVM, LibraryExchangeRequestVM } from 'src/app/shared/models/VM/businessServices/LibraryExchangRequestVM';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { LibraryExchangeRequestService } from 'src/app/shared/services/businessServices/library-exchange-request.service';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-libraries-exchange-follow',
  templateUrl: './libraries-exchange-follow.component.html',
  styleUrls: ['./libraries-exchange-follow.component.scss']
})
export class LibrariesExchangeFollowComponent implements OnInit {

  RequestId: any
  decesion = true;
  userId: string
  LibRequestVM: LibraryExchangeRequestVM = new LibraryExchangeRequestVM()
  requestStatusesList: CommonVM[];
  serviceRating: ServiceRatingVM = new ServiceRatingVM();
  CommentVm : GiftBackCommentVM = new GiftBackCommentVM();
  ListToView: Array<LibraryExchangeBookVM> = new Array<LibraryExchangeBookVM>()
  ListOfComment: Array<GiftBackCommentVM> = new Array<GiftBackCommentVM>()
  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }
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
    public serviceRatingService: ServiceRatingService,
    public LibraryService: LibraryExchangeRequestService
    
    
    ) { }

    ngOnInit(): void {
      this.userId = this.global.getCurrentUserId();
      this.getRequestStatusesList();
      if (this.activeRoute.snapshot.paramMap.get('id') != null) {
        this.RequestId = this.activeRoute.snapshot.paramMap.get('id');
        this.getRequestById(this.RequestId, this.userId);
        this.getAllRequestComment(this.RequestId)
  
      } else {
        this.ListToView = new Array<LibraryExchangeBookVM>()
      }
    }

    getRequestById(RequestId: number, userId: string) {
      this.spinner.show()
      this.LibraryService.getRequestById(RequestId, userId).then(
        (res) => {
  
          const result = res as LibraryExchangeRequestVM
          // console.log(result)
          this.LibRequestVM.id = result.id
          this.LibRequestVM.exchangeBooks = this.ListToView = result.exchangeBooks
          this.LibRequestVM.userId = this.global.getCurrentUserId();
          this.LibRequestVM.beneficiaryEmail = result.beneficiaryEmail
          this.LibRequestVM.beneficiaryName = result.beneficiaryName
          this.LibRequestVM.beneficiaryMobile = result.beneficiaryMobile
          this.LibRequestVM.reasonOfRejection = result.reasonOfRejection
          this.LibRequestVM.instructions = result.instructions
          this.LibRequestVM.requestStatusId= result.requestStatusId;
          this.LibRequestVM.createdBy= result.createdBy;
          this.LibRequestVM.createdDate= result.createdDate;
          this.decesion = (result.requestStatusId == RequestStatusEnum.Pending)||(result.requestStatusId ==RequestStatusEnum.Rejected) ? false : true;
         
        }
      ).finally(()=>{
        this.getServiceRatingByUserId();
        this.spinner.hide();
      })
    }

    getAllRequestComment(RequestId: number) {
      this.spinner.show()
      this.LibraryService.getAllRequestComment(RequestId).then(
        (res) => {
  
          const result = res as Array<GiftBackCommentVM>
          this.ListOfComment = result;
          this.spinner.hide();
        }
      )
    }
  
    AddComment(){
      if (!this.CommentVm.comment) {
        return;
      }else{
        this.spinner.show()
        this.CommentVm.RequestId = this.LibRequestVM.id
        this.CommentVm.userName = this.global.getUserFromLocalStorage().fullName
        this.CommentVm.createdDate = new Date();
        this.LibraryService.createNewComment(this.CommentVm).then().finally(() => {
          if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
            this.getAllRequestComment(this.LibRequestVM.id)
            this.spinner.hide();
            this.CommentVm = new GiftBackCommentVM();
           
          }     
        });
      }
    }
  
    getServiceRatingByUserId() {
      this.serviceRatingService.getServiceRatingByUserId(this.userId, 11).then((res) => {
        let result = res as ServiceRatingVM;
        this.serviceRating = result;
  
        if(!result){
          this.serviceRating = new ServiceRatingVM();
          this.serviceRating.rate = 0;
        }
      });
    }
  
    getRequestStatusesList(){
      this.commonService.GetCommonsByDomain("RequestStatus").then((res) => {
        const result = res as Array<CommonVM>;
  
        this.requestStatusesList = result;
      });
    }
  
    getRequestStatusById(requestStatusId: number){
      let status = this.requestStatusesList.find(s => s.id == requestStatusId);
  
      return this.translate.currentLang == 'en' ? status.value : status.valueArabic;
    }


    isMyReply(reply: GiftBackCommentVM){
      if(reply.createdBy == this.userId){
        return true;
      }
      else{
        return false;
      }
    }

    createOrUpdateServiceRating(){
      if(this.serviceRating.rate > 0){
        if(this.serviceRating.id){
          this.serviceRating.updatedBy = this.userId;
        }
        else{
          this.serviceRating.serviceType = 11;
          this.serviceRating.requestId = this.LibRequestVM.id;
          this.serviceRating.userId = this.userId;
          this.serviceRating.createdBy = this.userId;
        }
        this.serviceRatingService.createOrUpdateServiceRating(this.serviceRating).then()
        .finally(() => {
          
        });
      }
    }

}
