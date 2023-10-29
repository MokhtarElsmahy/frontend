import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() accType: string;

  constructor(private router: Router , private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
  
    if (this.router.url.includes('auth/admin/')){
      this.accType = 'admin';
    }
    // else if (this.router.url.includes('auth/employee/')) {
    //   this.accType = 'employee';
    // }
    else if (this.router.url.includes('auth/supplies/')) {
      this.accType = 'supplies';
    }
    else if (this.router.url.includes('auth/libraryServices/')) {
      this.accType = 'libraryServices';
    }
    else if (this.router.url.includes('auth/programsAndEvents/')) {
      this.accType = 'programsAndEvents';
    }
    else if (this.router.url.includes('auth/universityThesises/')) {
      this.accType = 'universityThesises';
    }
    else if (this.router.url.includes('auth/technicalSupport/')) {
      this.accType = 'technicalSupport';
    }

    else if (this.router.url.includes('auth/publicAdminstration/')) {
      this.accType = 'publicAdminstration';
    }
    else if (this.router.url.includes('auth/printingArchiving/')) {
      this.accType = 'printingArchiving';
    }
    else if (this.router.url.includes('auth/technicalDepartment/')) {
      this.accType = 'technicalDepartment';
    }
    else if (this.router.url.includes('auth/femalBeneficicareis/')) {
      this.accType = 'femalBeneficicareis';
    }
    else if (this.router.url.includes('auth/giftSpecialLibraries/')) {
      this.accType = 'giftSpecialLibraries';
    }
    else if (this.router.url.includes('auth/maleLibRelations/')) {
      this.accType = 'maleLibRelations';
    }
    else if (this.router.url.includes('auth/femaleLibRelations/')) {
      this.accType = 'femaleLibRelations';
    }
    else{
      this.accType = 'user';
    }
    
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }

}
