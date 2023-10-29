import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionVM } from 'src/app/shared/models/VM/businessServices/SuggestionVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { CommonService } from 'src/app/shared/services/common.service';
import { PrintService } from 'src/app/shared/services/print.service';

@Component({
  selector: 'app-buy-book-print',
  templateUrl: './buy-book-print.component.html',
  styleUrls: ['./buy-book-print.component.scss']
})
export class BuyBookPrintComponent implements OnInit {

  @Input() model: SuggestionVM;
  BookTypesList: CommonVM[];
  
  constructor(public printService: PrintService,
              public commonService: CommonService,
              public translate: TranslateService) { }

  ngOnInit(): void {
    this.getModelToPrintFromService();
    this.getBookTypes();
  }

  getModelToPrintFromService(){
    this.printService.currentModel.subscribe(currModel => this.model = currModel);
  }

  getBookTypes() {
    this.commonService.GetCommonsByDomain('BookType').then((res) => {
      const result = res as Array<CommonVM>;

      this.BookTypesList = result;
    });
  }

  getBookTypeById(bookTypeId: number){
    let bookType = this.BookTypesList.find(t => t.id == bookTypeId);
    return this.translate.currentLang == 'en' ? bookType.value : bookType.valueArabic;
  }
}
