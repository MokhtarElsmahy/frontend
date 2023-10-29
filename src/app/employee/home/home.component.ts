import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user;
  employeeType;
  isMainAdmin: boolean
  isAdmin: boolean
  constructor(private spinner: NgxSpinnerService, public global: GlobalService) { }

  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);

    this.user = this.global.getUserFromLocalStorage();

    // this.user.roleCode.map(c => { this.isMainAdmin = c == 'HaramMosqueLib' ? true : false });
    // this.user.roleCode.map(c => { this.isAdmin = c == 'Admin' ? true : false });

    var mainAdmin = this.user.roleCode.filter(c => c == 'HaramMosqueLib')[0]
    if (mainAdmin)
      this.isMainAdmin = true;
    else
      this.isMainAdmin = false;

      var Admin = this.user.roleCode.filter(c => c == 'Admin')[0]
      if (localStorage.getItem('activeRoleCode') == 'publicAdminstration') {
  
        if (Admin) {
          this.isAdmin = true;
          this.isMainAdmin = false;
        }
        else
          this.isAdmin = false;
      }
      else
      this.isAdmin = false;

    switch (localStorage.getItem('activeRoleCode')) {
      // case 'Employee':
      //   this.employeeType = 'employee';
      //   break;
      case 'Supplies':
        this.employeeType = 'supplies';
        break;
      case 'LibraryServices':
        this.employeeType = 'libraryServices';
        break;
      case 'ProgramsAndEvents':
        this.employeeType = 'programsAndEvents';
        break;
      case 'UniversityThesises':
        this.employeeType = 'universityThesises';
        break;
      case 'TechnicalSupport':
        this.employeeType = 'technicalSupport';
        break;
      case 'GiftSpecialLibraries':
        this.employeeType = 'GiftSpecialLibraries';
        break;
      case 'TechnicalDepartment':
        this.employeeType = 'TechnicalDepartment';
        break;
      case 'PrintingArchiving':
        this.employeeType = 'PrintingArchiving';
        break;
      case 'FemalBeneficicareis':
        this.employeeType = 'FemalBeneficicareis';
        break;
      case 'PublicAdminstration':
        this.employeeType = 'PublicAdminstration';
        break;

      case 'MaleLibRelations':
        this.employeeType = 'MaleLibRelations';
        break;
      case 'FemaleLibRelations':
        this.employeeType = 'FemaleLibRelations';
        break;

      // case 'PublicAdminstration-MaleHaramMacciLib-':
      //   this.employeeType = 'publicAdminstration';
      //   break;
      // case 'PublicAdminstration-FemaleHaramMacciLib-':
      //   this.employeeType = 'publicAdminstration';
      //   break;
      // case 'PublicAdminstration-HaramMosqueLib-':
      //   this.employeeType = 'publicAdminstration';
      //   break;
    }
  }

}
