import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { RecaptchaRequest } from 'src/app/shared/models/DTO/RecaptchaRequest';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { UserRegisterationVM } from 'src/app/shared/models/VM/UserRegisterationVM';
import { AccountService } from 'src/app/shared/services/account.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public userName: any;
  public password: any;
  public error = null;
  token: any;
  recapt: string = '';
  recaptchaRequest: RecaptchaRequest;
  userToRegister = new UserRegisterationVM();
  isEmailExisted: boolean;
  isPasswordMatched: boolean = true;
  staticAlertClosed = true;
  clickRegisterUser = false;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  urlPrefix: string;

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public userService: UserService,
    public accountService: AccountService,
    public global: GlobalService,
    public alertConfig: NgbAlertConfig,
    private spinner: NgxSpinnerService) {
    alertConfig.type = 'success';
  }

  ngOnInit(): void {
    this.urlPrefix = window.location.href.split('/register')[0];
    this.recaptchaRequest = {} as RecaptchaRequest;
  }


  SendRecapcha(event) {

    this.recaptchaRequest.Recaptcha = event;

    //console.log(this.recaptchaRequest.Recaptcha);

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

  submitForm(f: NgForm) {
    if (f.valid && this.userToRegister.password == this.userToRegister.passwordconfirm) {
      this.clickRegisterUser = true;
      this.isPasswordMatched = true;
      this.userToRegister.userName = this.userToRegister.email;
      // this.userToRegister.defaultRole = 'Visitor';
      this.userToRegister.roleName = new Array<string>();
      //this.userToRegister.roleName[0] = 'Visitor';
      //this.userToRegister.active = false;
      this.userToRegister.activationPageUrl = this.urlPrefix + "/account-activation";

      this.spinner.show();
      this.accountService.registerUser(this.userToRegister, this.recaptchaRequest.Recaptcha).then((res: any) => {
        if (res.data == 'ExistedEmail') {
          this.isEmailExisted = true;
        }
      })
        .finally(() => {
          if (!this.isEmailExisted) {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.clickRegisterUser = false;
                this.staticAlert.close();
                this.router.navigateByUrl("/login");
              }, 4000);
            }
          }
          else {
            this.clickRegisterUser = false;
          }
        });
    }
    else {
      f.form.markAllAsTouched();
      if (this.userToRegister.password != this.userToRegister.passwordconfirm) {
        this.isPasswordMatched = false;
      }
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
