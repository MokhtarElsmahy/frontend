import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { GiftedBookVM } from 'src/app/shared/models/VM/businessServices/GiftedBookVM';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
import { BookGiftServiceEnum } from 'src/app/shared/services/CommonsEnums';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-book-gift-list',
  templateUrl: './book-gift-list.component.html',
  styleUrls: ['./book-gift-list.component.scss']
})
export class BookGiftListComponent implements OnInit {
  listToView = [];
  userId;
  giftRequestId;
  giftRequest: GiftRequestVM = new GiftRequestVM();
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;
  giftTypesList: CommonVM[];
  requestStatusesList: CommonVM[];
  
  public get BookGiftServiceEnum(): typeof BookGiftServiceEnum {
    return BookGiftServiceEnum; 
  }

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private activeRoute: ActivatedRoute,
    private alertConfig: NgbAlertConfig,
    public router: Router,
    public GiftRequestService: GiftRequestService,
    public confirmationModalService: ConfirmationModalService,
    public global: GlobalService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.giftRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getGiftRequestById(this.giftRequestId, this.userId);
    }
  }
  isCheckedsubmit = false;
  isCheckedgift = false;
  checkuncheckall(){
    if(this.isCheckedsubmit == true)
  {
    this.isCheckedsubmit = false;
    this.isCheckedgift = false;
    this.listToView.forEach(book => {
      book.bookStatusId = BookGiftServiceEnum.NotRecieved;
    });
  }
  else
  {
    this.isCheckedsubmit = true;
    this.listToView.forEach(book => {
      book.bookStatusId = BookGiftServiceEnum.Recieved;
    });
  }
  
}

  checkuncheckallgift() {
    if (this.isCheckedgift == true) {
      this.isCheckedgift = false;
      this.listToView.forEach(book => {
        if (book.bookStatusId == BookGiftServiceEnum.Recieved)
          book.bookStatusId = BookGiftServiceEnum.Givable;
        else
          book.bookStatusId = BookGiftServiceEnum.NotRecieved;
      });
    }
    else {
      this.isCheckedgift = true;
      this.isCheckedsubmit = true;
      this.listToView.forEach(book => {
        book.bookStatusId = BookGiftServiceEnum.Givable;
      });
    }
  }
  
  changeIsAllCheckedRecieved(event){
    this.listToView.forEach(book => {
      book.isRecieved = event.target.checked;
      if(!event.target.checked){
        book.isForGiving = false;
        this.isCheckedgift = false;
      }
    });
  }
  
  changeIsAllCheckedForGiving(event){
    this.listToView.forEach(book => {
      book.isForGiving = event.target.checked;
      if(event.target.checked){
        book.isRecieved = true;
        this.isCheckedsubmit = true;
      }
    });
  }

  changeIsGivableStatus(book){
    if(!book.isForGiving){
      book.isForGiving = true;
      book.isRecieved = true;
    }
    else{
      this.isCheckedgift = false;
    }
  }

  changeIsRecievedStatus(book){
    if(book.isRecieved || (!book.isRecieved && this.isCheckedsubmit)){
      book.isRecieved = false;
      book.isForGiving = false;
      this.isCheckedsubmit = false;
      this.isCheckedgift = false;
    }
  }

  getGiftRequestById(giftRequestId: number, userId: string) {
    this.spinner.show();
    this.GiftRequestService.getGiftRequestById(giftRequestId, userId).then((res) => {
      this.giftRequest = res as GiftRequestVM;
      let books = this.giftRequest.giftedBooks;
      
      books.map(x=> {
        this.listToView.push({
         'id' : x.id,
         'giftRequestId': x.giftRequestId,
         'standardBookNumber': x.standardBookNumber,
         'bookTitle': x.bookTitle,
         'authorName': x.authorName,
         'publisherName': x.publisherName,
         'publicationDate': x.publicationDate,
         'numberOfCopies': x.numberOfCopies,
         'numberOfCopiesRemaining': x.numberOfCopiesRemaining,
         'bookStatusId': x.bookStatusId,
         'createdBy': x.createdBy,
         'createdDate': x.createdDate,
         'updatedBy': x.updatedBy,
         'updatedDate': x.updatedDate,
         'isRecieved': x.bookStatusId == BookGiftServiceEnum.Recieved || x.bookStatusId == BookGiftServiceEnum.Givable ? true : false,
         'isForGiving': x.bookStatusId == BookGiftServiceEnum.Givable ? true : false
        });
      });
      this.spinner.hide();
    });
  }

  updateBooksList(){
    this.spinner.show();    
    this.listToView.forEach(book => {
      if(book.isForGiving)
        book.bookStatusId = BookGiftServiceEnum.Givable;
      else if(book.isRecieved && !book.isForGiving)
        book.bookStatusId = BookGiftServiceEnum.Recieved;
      else
        book.bookStatusId = BookGiftServiceEnum.NotRecieved;  
    });

    this.GiftRequestService.updateGiftedBooksList(this.listToView).then()
    .finally(() => {
      if(!this.global.Messages.find(m => m.type == MessageEnum.Error)){
        this.spinner.hide();
        this.staticAlertClosed = false;
        setTimeout(() => {
          this.staticAlert.close();
          this.router.navigateByUrl("/auth/libraryServices/book-gift-view");
        }, 2000);
      }     
    });
  }
}
