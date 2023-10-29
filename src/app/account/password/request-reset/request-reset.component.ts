import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { ForgetPasswordMailVM } from 'src/app/shared/models/VM/ForgetPasswordMailVM';
import { AccountService } from 'src/app/shared/services/account.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';
import { ResetPasswordService } from '../../services/reset-password.service';
import { RecaptchaRequest } from 'src/app/shared/models/DTO/RecaptchaRequest';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit {

  public email: null;

  public error = null;
  public massage = null;
  urlPrefix: string;
  isEmailExisted: boolean = null;
  token: any;
  recapt: string = '';
  recaptchaRequest: RecaptchaRequest;
  constructor(public global: GlobalService,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
    public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    private resetPasswordService: ResetPasswordService,
    private accountService: AccountService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.urlPrefix = window.location.href.split('/request-password-reset')[0];
    this.recaptchaRequest = {} as RecaptchaRequest;
  }

  SendRecapcha(event) {

    this.recaptchaRequest.Recaptcha = event;

    //console.log(this.recaptchaRequest.Recaptcha);

  }

  handleResponse(data: any) {
    this.email = null;
    // console.log(data);
    if (data.status == 0)
      this.handleError(data.messages[1]);
    else
      this.massage = data.messages[1];
  }

  handleError(error: any) {
    this.error = error;

  }

  onSubmit(f: NgForm) {
    if (f.valid) {
      let forgetPasswordMailModel = new ForgetPasswordMailVM();
      forgetPasswordMailModel.email = this.email;
      forgetPasswordMailModel.pageUrl = this.urlPrefix;
      this.spinner.show();
      this.global.Messages = [];
      this.accountService.sendForgetPasswordMail(forgetPasswordMailModel, this.recaptchaRequest.Recaptcha).then()
        .finally(() => {
          if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
            this.spinner.hide();
            this.openModal();
            this.confirmationModalService.modalType = 'message';
            this.confirmationModalService.message = this.translate.currentLang == 'en' ? "Please follow the link sent to your email to reset your password"
              : "من فضلك اتبع الرابط المرسل إلى بريدك الإليكتروني لإعادة تعيين كلمة المرور الخاصة بك";
            this.confirmationModalService.caller = this;
            this.email = null;
            f.resetForm();
          }
        });
    }
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true, size: 'md' });
  }
}
