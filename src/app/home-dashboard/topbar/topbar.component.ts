import { Component, OnInit } from '@angular/core';
import { registerLocaleData, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import localAr from '@angular/common/locales/ar-SA';
import { TopBarService } from 'src/app/services/top-bar.service';
import { UserNotification } from 'src/app/shared/models/DTO/uer-notification';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
registerLocaleData(localAr);

declare function hijriDate(): void;

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  today: number = Date.now();

  todayDate = Date.now();
  nowFormatted: string;
  currentUser;
  userMainRole;
  currentRole;
  userRoles: Array<any> = new Array<any>();

  constructor(private router: Router, public global: GlobalService, public translate: TranslateService, private topBarService: TopBarService) { }

  ngOnInit(): void {
    hijriDate();
    this.currentUser = this.global.getUserFromLocalStorage();
    switch (this.currentUser?.defaultRoleCode) {
      case 'Admin':
        this.userMainRole = 'admin';
        break;
      // case 'Employee':
      //   this.userMainRole = 'employee';
      //   break;
      case 'Supplies':
        this.userMainRole = 'supplies';
        break;
      case 'LibraryServices':
        this.userMainRole = 'libraryServices';
        break;
      case 'ProgramsAndEvents':
        this.userMainRole = 'programsAndEvents';
        break;
      case 'UniversityThesises':
        this.userMainRole = 'universityThesises';
        break;
      case 'TechnicalSupport':
        this.userMainRole = 'technicalSupport';
        break;
      case 'TechnicalDepartment':
        this.userMainRole = 'technicalDepartment';
        break;
      case 'PrintingArchiving':
        this.userMainRole = 'printingArchiving';
        break;
      case 'FemalBeneficicareis':
        this.userMainRole = 'femalBeneficicareis';
        break;
      case 'PublicAdminstration':
        this.userMainRole = 'publicAdminstration';
        break;

      case 'MaleLibRelations':
        this.userMainRole = 'maleLibRelations';
        break;
      case 'FemaleLibRelations':
        this.userMainRole = 'femaleLibRelations';
        break;
      case 'GiftSpecialLibraries':
        this.userMainRole = 'giftSpecialLibraries';
        break;

      case 'Visitor':
        this.userMainRole = 'user';
        break;
    }
    this.getCurrentRole();
    this.getUserRolesValues();
    this.topBarService.getNotReadedNotification(this.currentUser.userId).then(result => {
      this.global.Notifications = (result as GenericVm<UserNotification[]>).data;
      this.getNotReadCount();
      console.log('this.global.Notifications');
      // console.log(this.global.Notifications);
    }).catch(/*res => this.global.spinner = false*/);
  }

  UpdateNotificationsToReaded() {
    this.topBarService.updateNotificationReaded(this.currentUser.userId);
    this.global.Notifications.forEach((element) => {
      element.readed = true;
    });
  }

  getCurrentRole() {
    if (!localStorage.getItem('activeRoleCode')) {
      switch (this.currentUser?.defaultRoleCode) {
        case 'Admin':
          this.currentRole = { 'nameEn': 'Admin', 'nameAr': 'مدير النظام' };
          break;
        // case 'Employee':
        //   this.currentRole = {'nameEn': 'Employee', 'nameAr': 'موظف'};
        //   break;
        case 'Supplies':
          this.currentRole = { 'nameEn': 'Supplies', 'nameAr': 'التوريدات والتزويدات' };
          break;
        case 'LibraryServices':
          this.currentRole = { 'nameEn': 'Library services', 'nameAr': 'الخدمات المكتبية' };
          break;
        case 'ProgramsAndEvents':
          this.currentRole = { 'nameEn': 'Programs and events', 'nameAr': 'البرامج والفعاليات' };
          break;
        case 'UniversityThesises':
          this.currentRole = { 'nameEn': 'University thesises', 'nameAr': 'الرسائل الجامعية' };
          break;
        case 'TechnicalSupport':
          this.currentRole = { 'nameEn': 'Technical support', 'nameAr': 'الدعم الفني' };
          break;
        case 'GiftSpecialLibraries':
          this.currentRole = { 'nameEn': 'Gift and Special Libraries', 'nameAr': 'الإهداء والمكتبات الخاصة' };
          break;
        case 'TechnicalDepartment':
          this.currentRole = { 'nameEn': 'Technical Department', 'nameAr': 'الشئون الفنية' };
          break;
        case 'PrintingArchiving':
          this.currentRole = { 'nameEn': 'Printing and Archiving', 'nameAr': 'الطباعة والارشفة' };
          break;
        case 'FemalBeneficicareis':
          this.currentRole = { 'nameEn': 'FemalBeneficicareis', 'nameAr': 'المستفيدات النسائية' };
          break;
        case 'PublicAdminstration':
          this.currentRole = { 'nameEn': 'PublicAdminstration', 'nameAr': 'الادارة العامه' };
          break;

        case 'MaleLibRelations':
          this.currentRole = { 'nameEn': 'Male Library Relations', 'nameAr': 'علاقات المكتبة رجال' };
          break;
        case 'FemaleLibRelations':
          this.currentRole = { 'nameEn': 'Female Library Relations', 'nameAr': 'علاقات المكتبة نساء' };
          break;
        case 'Visitor':
          this.currentRole = { 'nameEn': 'Visitor', 'nameAr': 'زائر' };
          break;
      }
    }
    else {
      switch (localStorage.getItem('activeRoleCode')) {
        case 'Admin':
          this.currentRole = { 'nameEn': 'Admin', 'nameAr': 'مدير النظام' };
          break;
        // case 'Employee':
        //   this.currentRole = {'nameEn': 'Employee', 'nameAr': 'موظف'};
        //   break;
        case 'Supplies':
          this.currentRole = { 'nameEn': 'Supplies', 'nameAr': 'إدارة التوريدات والتزويدات' };
          break;
        case 'LibraryServices':
          this.currentRole = { 'nameEn': 'Library services', 'nameAr': 'إدارة الخدمات المكتبية' };
          break;
        case 'ProgramsAndEvents':
          this.currentRole = { 'nameEn': 'Programs and events', 'nameAr': 'إدارة البرامج والفعاليات' };
          break;
        case 'UniversityThesises':
          this.currentRole = { 'nameEn': 'University thesises', 'nameAr': 'إدارة الرسائل الجامعية' };
          break;
        case 'TechnicalSupport':
          this.currentRole = { 'nameEn': 'Technical support', 'nameAr': 'الدعم الفني' };
          break;
        case 'GiftSpecialLibraries':
          this.currentRole = { 'nameEn': 'Gift and Special Libraries', 'nameAr': 'الإهداء والمكتبات الخاصة' };
          break;
        case 'TechnicalDepartment':
          this.currentRole = { 'nameEn': 'Technical Department', 'nameAr': 'الشئون الفنية' };
          break;
        case 'PrintingArchiving':
          this.currentRole = { 'nameEn': 'Printing and Archiving', 'nameAr': 'الطباعة والارشفة' };
          break;
        case 'FemalBeneficicareis':
          this.currentRole = { 'nameEn': 'FemalBeneficicareis', 'nameAr': 'المستفيدات النسائية' };
          break;
        case 'PublicAdminstration':
          this.currentRole = { 'nameEn': 'PublicAdminstration', 'nameAr': 'الادارة العامه' };
          break;

        case 'MaleLibRelations':

          this.currentRole = { 'nameEn': 'Male Library Relations', 'nameAr': 'علاقات المكتبة رجال' };
          break;
        case 'FemaleLibRelations':

          this.currentRole = { 'nameEn': 'Female Library Relations', 'nameAr': 'علاقات المكتبة نساء' };
          break;

        case 'Visitor':
          this.currentRole = { 'nameEn': 'Visitor', 'nameAr': 'زائر' };
          break;
      }
    }
  }

  changeCurrentRole(role) {
    switch (role.nameEn) {
      case 'Admin':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Admin', 'nameAr': 'مدير النظام' };
        break;
      // case 'Employee':
      //   this.router.navigateByUrl('/auth/'+role.routeType+'/home').then().finally(() =>{
      //     document.location.reload();
      //   });;
      //   this.currentRole = {'nameEn': 'Employee', 'nameAr': 'موظف'};
      //   break;
      case 'Supplies':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Supplies management', 'nameAr': 'إدارة التوريدات والتزويدات' };
        break;
      case 'LibraryServices':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Library services management', 'nameAr': 'إدارة الخدمات المكتبية' };
        break;
      case 'ProgramsAndEvents':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Programs and events management', 'nameAr': 'إدارة البرامج والفعاليات' };
        break;
      case 'UniversityThesises':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'University thesises management', 'nameAr': 'إدارة الرسائل الجامعية' };
        break;
      case 'TechnicalSupport':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Technical support', 'nameAr': 'الدعم الفني' };
        break;

      case 'GiftSpecialLibraries':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Gift & Special Libraries', 'nameAr': 'الإهداء والمكتبات الخاصة' };
        break;
      case 'TechnicalDepartment':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Technical Department', 'nameAr': 'الشون الفنية' };
        break;
      case 'PrintingArchiving':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Printing and Archiving', 'nameAr': 'الطباعة والارشفة' };
        break;
      case 'FemalBeneficicareis':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Femal Benefits', 'nameAr': 'المستفيدات النسائية' };
        break;
      case 'PublicAdminstration':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Public Adminstration', 'nameAr': 'الادارة العامه' };
        break;
      case 'MaleLibRelations':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Male Library Relations', 'nameAr': 'علاقات المكتبة رجال' };
        break;
      case 'FemaleLibRelations':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });;
        this.currentRole = { 'nameEn': 'Female Library Relations', 'nameAr': 'علاقات المكتبة نساء' };
        break;

      case 'Visitor':
        this.router.navigateByUrl('/auth/' + role.routeType + '/home').then().finally(() => {
          document.location.reload();
        });
        this.currentRole = { 'nameEn': 'Visitor', 'nameAr': 'زائر' };
        break;
    }
    localStorage.setItem('activeRoleCode', role.nameEn);


  }
  isAdmin: boolean
  getUserRolesValues() {
    //var ExceptionRoles =['HaramMosqueLib','FemaleHaramMacciLib','MaleHaramMacciLib']

    var Admin = this.currentUser.roleCode.filter(c => c == 'Admin')[0]

    if (Admin) {
      this.isAdmin = true;
    }
    else
      this.isAdmin = false;


    this.currentUser.roleCode.map(r => {
      this.userRoles.push({
        'nameEn': r, 'nameAr': (r == 'Admin' ? 'مدير النظام' : (r == 'Employee' ? 'موظف' : (r == 'Supplies' ? 'إدارة التوريدات والتزويدات' : (r == 'LibraryServices' ? 'إدارة الخدمات المكتبية' : (r == 'ProgramsAndEvents' ? 'إدارة البرامج والفعاليات' : (r == 'UniversityThesises' ? 'إدارة الرسائل الجامعية' : (r == 'GiftSpecialLibraries' ? 'الإهداء والمكتبات الخاصة' : (r == 'TechnicalDepartment' ? 'الشئون الفنية' : (r == 'PrintingArchiving' ? 'الطباعة والارشفة' : (r == 'FemalBeneficicareis' ? 'المستفيدات النسائية' : (r == 'PublicAdminstration' ? 'الادارة العامه' : (r == 'MaleHaramMacciLib' ? 'الادارة العامه -رجال' : (r == 'FemaleHaramMacciLib' ? 'الادارة العامه -نساء' : (r == 'HaramMosqueLib' ? 'الادارة العامه -المسجدالحرام' : (r == 'MaleLibRelations' ? 'علاقات المكتبة-رجال' : (r == 'FemaleLibRelations' ? 'علاقات المكتبة-نساء' : (r == 'TechnicalSupport' ? 'الدعم الفني' : 'زائر'))))))))))))))))),
        'routeType': (r == 'Admin' ? 'admin' : (r == 'Employee' ? 'employee' : (r == 'Supplies' ? 'supplies' : (r == 'LibraryServices' ? 'libraryServices' : (r == 'ProgramsAndEvents' ? 'programsAndEvents' : (r == 'UniversityThesises' ? 'universityThesises' : (r == 'GiftSpecialLibraries' ? 'giftSpecialLibraries' : (r == 'TechnicalDepartment' ? 'technicalDepartment' : (r == 'PrintingArchiving' ? 'printingArchiving' : (r == 'FemalBeneficicareis' ? 'femalBeneficicareis' : (r == 'PublicAdminstration' ? 'publicAdminstration' : (r == 'MaleHaramMacciLib' ? 'MaleHaramMacciLib' : (r == 'FemaleHaramMacciLib' ? 'FemaleHaramMacciLib' : (r == 'HaramMosqueLib' ? 'HaramMosqueLib' : (r == 'MaleLibRelations' ? 'maleLibRelations' : (r == 'FemaleLibRelations' ? 'femaleLibRelations' : (r == 'TechnicalSupport' ? 'technicalSupport' : 'user')))))))))))))))))
      });
    });
  }

  getDate() {
    var nowYearAr = formatDate(this.todayDate, 'yyyy', 'ar-SA');
    var nowMonAr = formatDate(this.todayDate, 'MMM', 'ar-SA');
    var nowDayAr = formatDate(this.todayDate, 'd', 'ar-SA');
    var currentDate = Intl.NumberFormat('ar-SA', {}).format(+nowDayAr) + " " + nowMonAr + " " + Intl.NumberFormat('ar-SA', {}).format(+nowYearAr);
    // var nowYearEn = formatDate(this.todayDate, 'yyyy', 'en-US');
    // var nowMonEn = formatDate(this.todayDate, 'MMM', 'en-US');
    // var nowDayEn = formatDate(this.todayDate, 'd', 'en-US');
    // var currentDate = this.translate.currentLang == 'en' ?  Intl.NumberFormat('ar-SA', {}).format(+nowDayEn) + " " + nowMonEn + " " + Intl.NumberFormat('ar-SA', {}).format(+nowYearEn)
    //                                                      :  Intl.NumberFormat('ar-SA', {}).format(+nowDayAr) + " " + nowMonAr + " " + Intl.NumberFormat('ar-SA', {}).format(+nowYearAr);
    return currentDate.replace('٬', '');
  }
  logout(event: MouseEvent) {
    event.preventDefault();
    this.global.resetUser();
    this.router.navigateByUrl('/login');
  }
  changeLang(lang: any) {
    this.global.useLanguage(lang)
  }

  getNotReadCount() {
    return this.global.Notifications.filter((obj) => obj.readed === false).length;

  }

  notificationActionLink(notifyRoute) {
    var notificationAction = "";
    if (environment.appContext === '') {
      notificationAction = notifyRoute;
    }
    else {
      notificationAction = '/' + environment.appContext + notifyRoute;
    }

    return notificationAction;
  }

}
