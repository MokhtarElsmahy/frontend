import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { GiftedBookVM } from 'src/app/shared/models/VM/businessServices/GiftedBookVM';
import { GiftRequestVM } from 'src/app/shared/models/VM/businessServices/GiftRequestVM';
import { CommonVM } from 'src/app/shared/models/VM/CommonVM';
import { GiftRequestService } from 'src/app/shared/services/businessServices/giftRequest.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BooksAdditionTypesEnum, GiftTypesEnum, RequestStatusEnum } from 'src/app/shared/services/CommonsEnums';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';
import { BookGiftListComponent } from '../book-gift-list/book-gift-list.component';

@Component({
  selector: 'app-book-gift-form',
  templateUrl: './book-gift-form.component.html',
  styleUrls: ['./book-gift-form.component.scss']
})

export class BookGiftFormComponent implements OnInit {
  dropdownList = [];
  dropdownSettings = {};

  currentRate = 4;

  userId: string;
  isEditMode: boolean = false;
  giftRequest = new GiftRequestVM();
  giftRequestId;
  allGiftedBooksList = [];
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  giftRequestWithBooksFile: FormData;
  public giftedBooksForm: FormGroup;
  bookTitleBySearch: boolean[] = [false];
  baseUrl: string;
  excelTemplateFileName = 'ExcelTemplateForBooksData.xlsx';

  public get RequestStatusEnum(): typeof RequestStatusEnum {
    return RequestStatusEnum;
  }

  public get GiftTypesEnum(): typeof GiftTypesEnum {
    return GiftTypesEnum;
  }

  public get BooksAdditionTypesEnum(): typeof BooksAdditionTypesEnum {
    return BooksAdditionTypesEnum;
  }

  constructor(private _fb: FormBuilder,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public giftRequestService: GiftRequestService,
    public commonService: CommonService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService) {
    this.baseUrl = environment.api_url;
    this.giftedBooksForm = this._fb.group({
      giftedBooks: this._fb.array([this.addGiftedBooksGroup()])
    });
  }

  ngOnInit(): void {
    this.giftRequestWithBooksFile = new FormData();
    this.userId = this.global.getCurrentUserId();
    if (this.activeRoute.snapshot.paramMap.get('id') != null) {
      this.isEditMode = true;
      this.giftRequestId = this.activeRoute.snapshot.paramMap.get('id');
      this.getGiftRequestById(this.giftRequestId, this.userId);
    }
    else {
      this.giftRequest.giftTypeId = GiftTypesEnum.IndividualBooks;
      this.giftRequest.additionTypeId = BooksAdditionTypesEnum.AddToInternalAndExternalGiftingDepartments;
    }
    this.getAllGiftedBooks(this.userId);
    this.autoFillUserInfo();
    this.dropdownList = [
      { item_id: 1, item_text: ' كتاب كتاب كتاب كتاب كتاب كتاب كتاب كتاب كتاب كتاب' },
      { item_id: 2, item_text: 'الحرم' },
    ];

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }

  BrowseBooks() {
    const modalRef = this.modalService.open(BookGiftListComponent, { centered: true, size: 'lg' });
  }

  //Append Fields Set
  private addGiftedBooksGroup(): FormGroup {
    return this._fb.group({
      bookTitle: [],
      standardBookNumber: [],
      authorName: [],
      publisherName: [],
      publicationDate: [],
      numberOfCopies: [],
    });
  }

  //Add Fields
  addGiftedBooks(): void {
    if (this.giftedBooksForm.controls['giftedBooks'].valid) {
      this.giftedBooksArray.push(this.addGiftedBooksGroup());
      this.bookTitleBySearch.push(false);
    }
    else
      this.giftedBooksForm.controls['giftedBooks'].markAllAsTouched();
  }

  //Remove Fields
  removegiftedBooks(index: number): void {
    this.giftedBooksArray.removeAt(index);
    this.bookTitleBySearch.splice(index, 1);
  }
  //Fields Array
  get giftedBooksArray(): FormArray {
    return <FormArray>this.giftedBooksForm.get('giftedBooks');
  }

  autoFillUserInfo() {
    if (!this.giftRequest.supplierName) {
      this.giftRequest.supplierName = this.global.getUserFromLocalStorage().fullName;
    }

    if (!this.giftRequest.supplierEmail) {
      this.giftRequest.supplierEmail = this.global.getUserFromLocalStorage().email;
    }

    if (!this.giftRequest.supplierMobile) {
      this.giftRequest.supplierMobile = this.global.getUserFromLocalStorage().phoneNumber;
    }
  }

  // Only Integer Numbers
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  handleFileInput(files: FileList, fileType: string, form: NgForm) {
    if (files.item(0).size <= environment.FileSize && (files.item(0).type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || files.item(0).type == 'application/msword' || files.item(0).type == 'application/pdf') {
      this.giftRequestWithBooksFile.delete(fileType);
      this.giftRequestWithBooksFile.append(fileType, files.item(0));
    }
    else {
      form.controls[fileType].setValue(null);
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "The file type should be xlsx only"
        : "يجب أن يكون الملف بصيغة xlsx فقط";
    }
  }

  getGiftRequestById(giftRequestId: number, userId: string) {
    this.giftRequestService.getGiftRequestById(giftRequestId, userId).then((res) => {
      let data = res as GiftRequestVM;
      this.giftRequest = data;
      // console.log(data);
    });
  }

  getAllGiftedBooks(userId: string) {
    this.giftRequestService.getGiftedBooksList(userId).then((res) => {
      let result = res as GiftedBookVM[];

      result.map(x => {
        this.allGiftedBooksList.push({ 'item_id': x.id, 'item_text': x.bookTitle });
      });
    });
  }

  onTitleSelect(selectedItem, index) {
    this.giftedBooksForm.controls['giftedBooks'].get(index.toString())?.get('bookTitle').setValue(selectedItem.item_text);
  }

  confirmSubmission(f: NgForm) {
    let validCase1 = (this.giftRequest.giftTypeId == GiftTypesEnum.IndividualBooks && this.giftedBooksForm.controls['giftedBooks'].valid);
    let validCase2 = (this.giftRequest.giftTypeId == GiftTypesEnum.PrivateLibrary && !this.giftedBooksForm.controls['giftedBooks'].dirty);
    let validCase3 = (this.isEditMode && (!this.giftedBooksForm.controls['giftedBooks'].dirty || (<FormArray>this.giftedBooksForm.controls['giftedBooks']).controls.every(c => Object.values((<FormGroup>c).value).every(x => x === null || x === ''))));
    if (f.valid && (validCase1 || validCase2 || validCase3)) {
      this.giftedBooksForm.controls['giftedBooks'].markAsUntouched();
      this.openModal();
      this.confirmationModalService.modalType = 'confirmation';
      this.confirmationModalService.message = !this.isEditMode ? (this.translate.currentLang == 'en' ? "Are you sure, you want to confirm the request ?"
        : "هل أنت متأكد ، تريد تأكيد الطلب ؟")
        : (this.translate.currentLang == 'en' ? "Are you sure, you want to save the changes ?"
          : "هل أنت متأكد ، تريد حفظ التعديلات ؟");
      this.confirmationModalService.caller = this;
    }
    else {
      f.form.markAllAsTouched();
      if (this.giftedBooksForm.controls['giftedBooks'].dirty) {
        this.giftedBooksForm.controls['giftedBooks'].markAllAsTouched();
      }
    }
  }

  submitForm() {
    this.giftRequest.userId = this.userId;
    this.giftRequest.giftedBooks = this.giftedBooksArray.controls.map(c => c.value);
    if (this.giftRequest.giftedBooks && this.giftRequest.giftedBooks[0].bookTitle) {
      this.giftRequest.giftedBooks.forEach(book => {
        book.publicationDate = book.publicationDate.year + '-' + (book.publicationDate.month > 9 ? book.publicationDate.month : '0' + book.publicationDate.month) + '-' + (book.publicationDate.day > 9 ? book.publicationDate.day : '0' + book.publicationDate.day);
        book.createdBy = this.userId;
      });
    }
    else {
      this.giftRequest.giftedBooks = null;
    }
    if (this.isEditMode) {
      this.giftRequest.updatedBy = this.userId;
      this.spinner.show();
      this.global.Messages = [];
      this.giftRequestService.updateGiftRequest(this.giftRequest).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
              this.router.navigateByUrl("/auth/user/book-gift-view");
            }, 2000);
          }
        });
    }
    else {
      this.giftRequest.isArchived = false;
      this.giftRequest.createdBy = this.userId;
      this.giftRequest.requestStatusId = RequestStatusEnum.Pending;
      this.spinner.show();
      this.global.Messages = [];
      if (this.giftRequest.booksDataFile) {
        this.giftRequestWithBooksFile.append('jsonString', JSON.stringify(this.giftRequest));
        this.giftRequestService.createNewGiftRequestWithBooksSheet(this.giftRequestWithBooksFile).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              this.confirmationModalService.response = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.router.navigateByUrl("/auth/user/book-gift-view");
              }, 2000);
            }
          });
      }
      else {
        this.giftRequestService.createNewGiftRequest(this.giftRequest).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              this.confirmationModalService.response = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.router.navigateByUrl("/auth/user/book-gift-view");
              }, 2000);
            }
          });
      }
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
