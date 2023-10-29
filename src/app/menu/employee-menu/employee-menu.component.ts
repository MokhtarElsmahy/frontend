import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-employee-menu',
  templateUrl: './employee-menu.component.html',
  styleUrls: ['./employee-menu.component.scss']
})
export class EmployeeMenuComponent implements OnInit {

  currentUser;
  employeeType;
  isMainAdmin: boolean;
  isAdmin: boolean;
  constructor(public global: GlobalService) { }

  ngOnInit(): void {
    this.currentUser = this.global.getUserFromLocalStorage();





    var mainAdmin = this.currentUser.roleCode.filter(c => c == 'HaramMosqueLib')[0]
    if (mainAdmin)
      this.isMainAdmin = true;
    else
      this.isMainAdmin = false;

    var Admin = this.currentUser.roleCode.filter(c => c == 'Admin')[0]
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


      // *************
      case 'TechnicalDepartment':
        this.employeeType = 'technicalDepartment';
        break;
      case 'FemalBeneficicareis':
        this.employeeType = 'femalBeneficicareis';
        break;
      case 'GiftSpecialLibraries':
        this.employeeType = 'giftSpecialLibraries';
        break;
      case 'PrintingArchiving':
        this.employeeType = 'printingArchiving';
        break;
      case 'PublicAdminstration':
        this.employeeType = 'publicAdminstration';
        
        break;

      case 'MaleLibRelations':
        this.employeeType = 'maleLibRelations';
        break;
      case 'FemaleLibRelations':
        this.employeeType = 'femaleLibRelations';
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
