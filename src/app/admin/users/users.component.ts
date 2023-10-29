import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbAlert, NgbAlertConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/shared/services/global.service';
import { UsersFormComponent } from '../users-form/users-form.component';
import { UserService } from 'src/app/shared/services/user.service';
import { UserVM } from 'src/app/shared/models/VM/UserVM';
import { MessageEnum } from 'src/app/shared/models/system/message.enum';
import { UserRoleVM } from 'src/app/shared/models/VM/Request/UserRoleVM';
import { ConfirmationModalService } from 'src/app/shared/services/confirmation-modal.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userId: string;
 
  listToView: Array<any> = new Array<any>();

  staticAlertClosed = true;
  @ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
  constructor(public translate: TranslateService,
    public router: Router,
    public userService: UserService,
    public global: GlobalService,
      public alertConfig: NgbAlertConfig,
      private modalService: NgbModal,
      public confirmationModalService: ConfirmationModalService, 
      private spinner: NgxSpinnerService) {
      alertConfig.type = 'success';
    }

  config1 = {
    value: false,
    height: 30,
    width: 80,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Visitor" : "زائـر",
      checked:  this.translate.currentLang == 'en' ? "Visitor" : "زائـر"
    },
  };

  // config2 = {
  //   value: false,
  //   height: 30,
  //   width: 80,
  //   margin: 3,
  //   fontSize: 13,
  //   color: {
  //     checked: "#297162",
  //     unchecked: "#dddddd"
  //   },
  //   labels: {
  //     unchecked:  this.translate.currentLang == 'en' ? "Employee" : "موظف",
  //     checked:  this.translate.currentLang == 'en' ? "Employee" : "موظف"
  //   },
  // };

  config3 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Supplies" : "التوريدات والتزويدات",
      checked:  this.translate.currentLang == 'en' ? "Supplies" : "التوريدات والتزويدات"
    },
  };

  config4 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Library services" : "الخدمات المكتبية",
      checked:  this.translate.currentLang == 'en' ? "Library services" : "الخدمات المكتبية"
    },
  };

  config5 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Programs and events" : "البرامج والفعاليات",
      checked:  this.translate.currentLang == 'en' ? "Programs and events" : "البرامج والفعاليات"
    },
  };

  config6 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "University thesises" : "الرسائل الجامعية",
      checked:  this.translate.currentLang == 'en' ? "University thesises" : "الرسائل الجامعية"
    },
  };

  config7 = {
    value: false,
    height: 30,
    width: 120,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked: this.translate.currentLang == 'en' ? "Technical support" : "الدعم الفني",
      checked:  this.translate.currentLang == 'en' ? "Technical support" : "الدعم الفني"
    },
  };

  config8 = {
    value: false,
    height: 30,
    width: 100,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Admin" : "مدير النظام",
      checked:  this.translate.currentLang == 'en' ? "Admin" : "مدير النظام"
    },
  };

  config9 = {
    value: false,
    height: 30,
    width: 100,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Inactive" : "غير مفعل",
      checked:  this.translate.currentLang == 'en' ? "Active" : "مفعل"
    },
  };

  // ***********************

  config10 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Public Adminstration" : "الادارة العامه",
      checked:  this.translate.currentLang == 'en' ? "Public Adminstration" : "الادارة العامه"
    },
  };

  config11 = {
    value: false,
    height: 30,
    width: 140,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Femal Beneficicareis" : "المستفيدات النسائية",
      checked:  this.translate.currentLang == 'en' ? "Femal Beneficicareis" : "المستفيدات النسائية"
    },
  };

  config12 = {
    value: false,
    height: 30,
    width: 150,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Male Haram Macci Lib" : "الحرم المكى-رجال",
      checked:  this.translate.currentLang == 'en' ? "Male Haram Macci Lib" : "الحرم المكى-رجال"
    },
  };

  config13 = {
    value: false,
    height: 30,
    width: 150,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Female Haram Macci Lib" : "الحرم المكى-نساء",
      checked:  this.translate.currentLang == 'en' ? "Female Haram Macci Lib" : "الحرم المكى-نساء"
    },
  };

  config14 = {
    value: false,
    height: 30,
    width: 150,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Haram Mosque Lib" : "المسجدالحرام",
      checked:  this.translate.currentLang == 'en' ? "Haram Mosque Lib" : "المسجد الحرام"
    },
  };

  config15 = {
    value: false,
    height: 30,
    width: 150,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Printing Archiving" : "الطباعه والارشفة",
      checked:  this.translate.currentLang == 'en' ? "Printing Archiving" : "الطباعه و الارشفه"
    },
  };

  config16 = {
    value: false,
    height: 30,
    width: 190,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Gift&Special Libraries" : "الاهداء والمكتبات الخاصه",
      checked:  this.translate.currentLang == 'en' ? "Gift&Special Libraries" : "الاهداء والمكتبات الخاصه"
    },
  };

  config17 = {
    value: false,
    height: 30,
    width: 150,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Technical Department" : "الشئون الفنية",
      checked:  this.translate.currentLang == 'en' ? "Technical Department" : "الشئون الفنيه"
    },
  };


  config18 = {
    value: false,
    height: 30,
    width: 180,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Male Library Relations" : "ادارة علاقات المكتبة رجال",
      checked:  this.translate.currentLang == 'en' ? "Male Library Relations" : "ادارة علاقات المكتبة رجال"
    },
  };

  config19 = {
    value: false,
    height: 30,
    width: 180,
    margin: 3,
    fontSize: 13,
    color: {
      checked: "#297162",
      unchecked: "#dddddd"
    },
    labels: {
      unchecked:  this.translate.currentLang == 'en' ? "Female Library Relations" : "ادارة علاقات المكتبة نساء",
      checked:  this.translate.currentLang == 'en' ? "Female Library Relations" : "ادارة علاقات المكتبة نساء"
    },
  };








  ngOnInit(): void {
    this.userId = this.global.getCurrentUserId();
    this.getAllUsers(this.userId);
  }

  getAllUsers(userId: string) {
    this.spinner.show();
    this.userService.getAllUsers().then((res) => {
    const result = res as Array<UserVM>;
  
    result.map(x=> {
      this.listToView.push({'id' : x.id, 'email':x.email, 'nameEnglish': (x.firstName +' '+ x.lastName), 'nameArabic': x.nameArabic,
       'isAdmin': this.checkHaveRole(x, 'Admin'), 'isEmployee': this.checkHaveRole(x, 'Employee'),  'isVisitor': this.checkHaveRole(x, 'Visitor'),
       'isSuppliesEmployee': this.checkHaveRole(x, 'Supplies'), 'isLibraryServicesEmployee': this.checkHaveRole(x, 'LibraryServices'),  'isProgramsAndEventsEmployee': this.checkHaveRole(x, 'ProgramsAndEvents'),
       'isUniversityThesisesEmployee': this.checkHaveRole(x, 'UniversityThesises'), 'isTechnicalSupportEmployee': this.checkHaveRole(x, 'TechnicalSupport'),
      
       'isPublicAdminstrationEmployee': this.checkHaveRole(x, 'PublicAdminstration'),
       'isFemalBeneficicareisEmployee': this.checkHaveRole(x, 'FemalBeneficicareis'),
       'isMaleHaramMacciLibEmployee': this.checkHaveRole(x, 'MaleHaramMacciLib'),
       'isFemaleHaramMacciLibEmployee': this.checkHaveRole(x, 'FemaleHaramMacciLib'),
       'isHaramMosqueLibEmployee': this.checkHaveRole(x, 'HaramMosqueLib'),
       'isPrintingArchivingEmployee': this.checkHaveRole(x, 'PrintingArchiving'),
       'isGiftSpecialLibrariesEmployee': this.checkHaveRole(x, 'GiftSpecialLibraries'),
       'isTechnicalDepartmentEmployee': this.checkHaveRole(x, 'TechnicalDepartment'),
       'isMaleLibRelationsEmployee': this.checkHaveRole(x, 'MaleLibRelations'),
       'isFemaleLibRelationsEmployee': this.checkHaveRole(x, 'FemaleLibRelations'),
       'active': x.active});
    });
    this.spinner.hide();
    setTimeout(() => {
      $('#users').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25,100],
        order: [],
        "language": {
          "lengthMenu": this.translate.currentLang == 'en' ? "Display _MENU_ in a page" : "عرض _MENU_ في الصفحة",
          "search": this.translate.currentLang == 'en' ? "Search" : "بحث",
          "paginate": {
            "last": this.translate.currentLang == 'en' ? "Last" : "الأخير",
            "first": this.translate.currentLang == 'en' ? "First" : "الأول",
            "next": this.translate.currentLang == 'en' ? "Next" : "التالي", 
            "previous": this.translate.currentLang == 'en' ? "Previous" : "السابق"
          },    
          "zeroRecords": this.translate.currentLang == 'en' ? "No data to show" : "لا يوجد بيانات",
          "info": this.translate.currentLang == 'en' ? "Display from _PAGE_ to _PAGES_" : "عرض صفحة  _PAGE_ من _PAGES_",
          "infoEmpty": this.translate.currentLang == 'en' ? "No data to show" : "لا يوجد بيانات",
          "infoFiltered": this.translate.currentLang == 'en' ? "Search in _MAX_ Element" : "(البحث ف _MAX_ عنصر)"
        }
      });
    }, 1);
    });
  }

  checkHaveRole(user: UserVM, roleName: string){
    if(user.userRoles.find(r => r.roleId == roleName)){
      return true;
    }
    else{
      return false;
    }
  }

  setUserRole(userId: string, roleId: string, isSet: boolean){
    let userRole = new UserRoleVM();
    userRole.userId = userId;
    userRole.roleId = roleId;
    userRole.isSet = isSet;
    this.spinner.show();
    this.global.Messages = [];
    this.userService.setUserRole(userRole).then()
    .finally(() => {
      if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
        this.spinner.hide();
        this.staticAlertClosed = false;
        setTimeout(() => {
          this.staticAlert.close();
        }, 2000);
      }
    });
  }
 
  updateUserActiveStatus(userId: string, isActive: boolean){
    this.spinner.show();
    this.global.Messages = [];
    this.userService.updateActiveStatus(userId, isActive).then()
    .finally(() => {
      if (!this.global.Messages.find(m => m.type == MessageEnum.Error)) {
        this.spinner.hide();
        this.staticAlertClosed = false;
        setTimeout(() => {
          this.staticAlert.close();
        }, 2000);
      }
    });
  }

  adduser(user?: UserVM) {
    const modalRef = this.modalService.open(UsersFormComponent, { centered: true , size: 'md' });
    this.confirmationModalService.model = user;
  }

  deleteConfirmation(user: UserVM){
    this.openModal();
    this.confirmationModalService.modalType = 'delete';
    this.confirmationModalService.model = user;
    this.confirmationModalService.confirmAction = this.userService.deleteUser;
    this.confirmationModalService.caller = this;
  }
  
  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true , size: 'md' });
  }
}
