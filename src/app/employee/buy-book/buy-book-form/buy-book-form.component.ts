import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service'; 
import { HttpRequestService } from 'src/app/shared/services/http-request.service';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { SuggestionService } from 'src/app/shared/services/businessServices/suggestion.service';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/system/message';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbAlert, NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-buy-book-form',
  templateUrl: './buy-book-form.component.html',
  styleUrls: ['./buy-book-form.component.scss'],
})
export class BuyBookFormComponent implements OnInit {

  userId: string;
  suggestion = new SuggestionVM();
  suggestionId;
  bookType: CommonVM;
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;

  constructor(public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public suggestionService: SuggestionService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig, 
    private spinner: NgxSpinnerService) {
      alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.suggestionId = this.activeRoute.snapshot.paramMap.get('id');
      this.getSuggestionById(this.suggestionId, this.userId);
    }
  }
  
  getBookType(){
    this.commonService.GetCommonsByDomain('BookType').then((res) => {
      const result = res as Array<CommonVM>;

      this.bookType = result.find(bt => bt.id == this.suggestion.bookTypeId);
    });
  }

  getSuggestionById(suggestionId: number, userId){
    this.spinner.show();
    this.suggestionService.getSuggestionById(suggestionId, userId).then((res) => {
      const result = res as SuggestionVM;

      this.suggestion = result;
      this.getBookType();
      this.spinner.hide();
    });
  }

}
