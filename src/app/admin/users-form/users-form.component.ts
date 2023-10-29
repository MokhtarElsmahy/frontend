import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { UserRegisterationVM } from 'src/app/shared/models/VM/UserRegisterationVM';
import { UserVM } from 'src/app/shared/models/VM/UserVM';
import { AccountService } from 'src/app/shared/services/account.service';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
  userId;
  isEditMode: boolean;
  userToRegister = new UserRegisterationVM();
  isPasswordMatched: boolean = true;
  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  isEmailExisted: boolean;

  constructor(public translate: TranslateService,
    public confirmationModalService: ConfirmationModalService,
    public activeModal: NgbActiveModal,
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
    this.userId = this.global.getCurrentUserId();
    if (this.confirmationModalService.model != null) {
      this.isEditMode = true;
      this.userId = this.confirmationModalService.model.id;
      this.getUserById(this.userId);
    }
  }

  getUserById(userId: string) {
    this.spinner.show();
    this.userService.getUserById(userId).then((res) => {
      let result = res as UserVM;

      this.userToRegister.userId = result.id;
      this.userToRegister.userName = result.userName;
      this.userToRegister.firstName = result.firstName;
      this.userToRegister.lastName = result.lastName;
      this.userToRegister.nameArabic = result.nameArabic;
      this.userToRegister.userName = result.userName;
      this.userToRegister.phoneNumber = result.phoneNumber;
      this.userToRegister.email = result.email;
      this.userToRegister.defaultRole = result.defaultRole;
      this.userToRegister.roleName = new Array<string>();
      result.roles.forEach(r => { this.userToRegister.roleName.push(r.name) });
      this.userToRegister.active = true;
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

  submitForm(f: NgForm) {
    if (f.valid && this.userToRegister.password == this.userToRegister.passwordconfirm) {
      this.isPasswordMatched = true;
      if (this.isEditMode) {
        this.spinner.show();
        this.global.Messages = [];
        this.accountService.registerOrUpdateUser(this.userToRegister).then((res: any) => {
          if (res.data == 'ExistedEmail') {
            this.isEmailExisted = true;
          }
        })
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/users");
                document.location.reload();
              }, 2000);
            }
          });
      }
      else {
        this.userToRegister.userName = this.userToRegister.email;
        this.userToRegister.defaultRole = 'Visitor';
        this.userToRegister.roleName = new Array<string>();
        this.userToRegister.roleName[0] = 'Visitor';
        this.userToRegister.active = true;

        this.spinner.show();
        this.global.Messages = [];
        this.accountService.registerOrUpdateUser(this.userToRegister).then()
          .finally(() => {
            if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
              this.spinner.hide();
              this.staticAlertClosed = false;
              setTimeout(() => {
                this.staticAlert.close();
                this.activeModal.close('Close click');
                this.router.navigateByUrl("/auth/admin/users");
                document.location.reload();
              }, 2000);
            }
          });
      }
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
