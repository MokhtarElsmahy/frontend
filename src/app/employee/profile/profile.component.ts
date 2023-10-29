import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { UserVM } from 'src/app/shared/models/VM/UserVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  requestsExuted:number=0;
  country:any[];
  errors:string;
  user: UserVM;
  userId:string;
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr: string;
  fileName:String;
  show=true;
  staticAlertClosed = true;
  @ViewChild('staticAlert', {static: false}) staticAlert: NgbAlert;
  userData: FormData = new FormData();

  constructor(private modalService: NgbModal,
              public global: GlobalService, 
              public translate: TranslateService,
              public confirmationModalService: ConfirmationModalService,
              private alertConfig: NgbAlertConfig ,
              public userService: UserService,
              public router: Router, 
              private spinner: NgxSpinnerService) { 
                alertConfig.type = 'success';
              }

  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getUserInfoByUserId();
  }

  getUserInfoByUserId(){
    this.spinner.show();
    this.userService.getUserById(this.userId).then((res) => {
      let result = res as UserVM;

      this.user = result;
      this.spinner.hide();
    });
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
  
  uploadImage(file: any) {
    if(file.target.files[0].type=='image/jpeg'||file.target.files[0].type=='image/jpg'||file.target.files[0].type=='image/png'){
     if (file.target.files && file.target.files[0]) {
       // HTML5 FileReader API
       let reader = new FileReader();
       reader.onload = (e: any) => {
         let image = new Image();
         image.src = e.target.result;
         image.onload = rs => {
           let imgBase64Path = e.target.result;
         };
       };
       this.handleInputChangeFile(file);
       
       // Reset if duplicate image uploaded again
       this.fileInput.nativeElement.value = "";
     } else {
       this.fileAttr = '  ملف  ';
     }
    }
 }

 handleInputChangeFile(e) {
   const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
   const pattern = /image-*/;
   const reader = new FileReader();
   reader.onload = this._handleReaderLoadedFile.bind(this);
   reader.readAsDataURL(file);
 }
 _handleReaderLoadedFile(e) {
   const reader = e.target;
 }
  
  handleFileInput(files: FileList, fileType: string) {
    if (files[0].type == 'image/jpeg' || files[0].type == 'image/jpg' || files[0].type == 'image/png') {
      $("#photo-pic").attr('src', URL.createObjectURL(files[0]));
      if (files.item(0).size <= environment.FileSize) {
        this.userData.delete(fileType);
        this.userData.append(fileType, files.item(0));
      }
    } else {
      this.openModal();
      this.confirmationModalService.modalType = 'message';
      this.confirmationModalService.message = this.translate.currentLang == 'en' ? "The picture extension is not vaild, choose another picture"
        : "امتداد الصورة غير صحيح ، عليك اختيار صورة أخرى";
      this.confirmationModalService.caller = this;
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }

  updateUserProfile(f: NgForm) {
    if(f.valid){
      this.spinner.show();
      this.global.Messages = [];
      this.userData.append('jsonString', JSON.stringify(this.user));
      this.userService.updateUserProfile(this.userData).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.staticAlertClosed = false;
            setTimeout(() => {
              this.staticAlert.close();
            }, 2000);
            this.ngOnInit();
          }
        });
    }
    else{
      f.form.markAllAsTouched();
    }
  }
}
