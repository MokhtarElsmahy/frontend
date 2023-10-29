import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service'; 
import { HttpRequestService } from 'src/app/shared/services/http-request.service';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { InquiryVM } from 'src/app/shared/models/VM/businessServices/InquiryVM';
import { InquiryService } from 'src/app/shared/services/businessServices/inquiry.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbAlert, NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceRatingVM } from 'src/app/shared/models/VM/businessServices/ServiceRatingVM';
import { ServiceRatingService } from 'src/app/shared/services/businessServices/serviceRating.service';
import { InquiryTypesEnum } from 'src/app/shared/services/CommonsEnums';

@Component({
  selector: 'app-ask-librarian-form',
  templateUrl: './ask-librarian-form.component.html',
  styleUrls: ['./ask-librarian-form.component.scss']
})
export class AskLibrarianFormComponent implements OnInit {

  userId: string;
  user;
  inquiry = new InquiryVM();
  inquiryId;
  pendingAnswer: boolean;
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;
  serviceRating: ServiceRatingVM;

  public get InquiryTypesEnum(): typeof InquiryTypesEnum {
    return InquiryTypesEnum; 
  }

  constructor(public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public inquiryService: InquiryService,
    public serviceRatingService: ServiceRatingService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
      alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.user = this.global.getUserFromLocalStorage();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.inquiryId = this.activeRoute.snapshot.paramMap.get('id');
      this.getInquiryById(this.inquiryId, this.userId);
    }
  }
  
  getInquiryById(inquiryId: number, userId: string){
    this.spinner.show();
    this.inquiryService.getInquiryById(inquiryId, userId).then((res) => {
      this.inquiry = res as InquiryVM;
      
      if(this.inquiry.response == null){
        this.pendingAnswer = true;
      }
      this.getServiceRatingByUserId();
      this.spinner.hide();
    });
  }

  getServiceRatingByUserId() {
    this.serviceRatingService.getServiceRatingByUserId(this.inquiry.createdBy, this.inquiry.type).then((res) => {
      let result = res as ServiceRatingVM;
      this.serviceRating = result;

      if(!result){
        this.serviceRating = new ServiceRatingVM();
        this.serviceRating.rate = 0;
      }
    });
  }
  
  submitForm(f: NgForm) {
    if(f.valid){
      this.inquiry.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.inquiryService.updateInquiry(this.inquiry).then()
      .finally(() => {
        if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
          this.spinner.hide();
          this.staticAlertClosed = false;
          setTimeout(() => {
            this.staticAlert.close();
            f.resetForm();
            switch(localStorage.getItem('activeRoleCode')){
              case 'LibraryServices':
                this.router.navigateByUrl("/auth/libraryServices/ask-librarian-view");
                break;
              case 'ProgramsAndEvents':
                this.router.navigateByUrl("/auth/programsAndEvents/ask-librarian-view");
                break;
              case 'TechnicalSupport':
                this.router.navigateByUrl("/auth/technicalSupport/ask-librarian-view");
                break;
              case 'FemalBeneficicareis':
                this.router.navigateByUrl("/auth/femalBeneficicareis/ask-librarian-view");
                break;
              case 'PublicAdminstration':
                this.router.navigateByUrl("/auth/publicAdminstration/ask-librarian-view");
                break;
            }
          }, 2000);
        }     
      });
    }
    else{
      f.form.markAllAsTouched();
    }
  }
}
