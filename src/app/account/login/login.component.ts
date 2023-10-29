import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginUser } from 'src/app/shared/models/DTO/LoginUser';
import { GenericVm } from 'src/app/shared/models/system/generic-vm';
import { ResponseStatusEnum } from 'src/app/shared/models/system/response-status.enum';
import { GlobalService } from 'src/app/shared/services/global.service';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public userName: any;
  public password: any;
  public error = null;
  return;
  returnn;
  constructor(private route: ActivatedRoute, private loginService: LoginService, private router: Router, public global: GlobalService,
    private spinner: NgxSpinnerService) { }


  ngOnInit(): void {
    this.global.resetUser();
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/');

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { category: "fiction" }
        this.returnn = params.return;

      }
      );
  }
  camalize(str) {
    // return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

    return str
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
  }
  login() {
    this.error = null;
    this.spinner.show();
    this.loginService.login(this.userName, this.password).subscribe(
      (data) => {
        let result = data as GenericVm<LoginUser>;
        if (result.status == ResponseStatusEnum.OK) {
          this.global.setUserAndUpdateTheApp(result.data);
          /*  console.log('result.data.roles');
           console.log(result.data.isAdmin);
           console.log(result.data.roleCode);
           alert(result.data.roleCode[0]);*/
          //if (result.data.isAdmin  && result.data.isActive)

          if (this.returnn && this.returnn.includes('/auth/user') && (
            result.data.defaultRoleCode == 'Admin' ||
            result.data.defaultRoleCode == 'Supplies' ||
            result.data.defaultRoleCode == 'LibraryServices' ||
            result.data.defaultRoleCode == 'ProgramsAndEvents' ||
            result.data.defaultRoleCode == 'UniversityThesises' ||
            result.data.defaultRoleCode == 'TechnicalSupport' ||
            result.data.defaultRoleCode == 'TechnicalDepartment' ||
            result.data.defaultRoleCode == 'FemaleLibRelations' ||
            result.data.defaultRoleCode == 'MaleLibRelations' ||
            result.data.defaultRoleCode == 'PublicAdminstration' ||
            result.data.defaultRoleCode == 'PrintingArchiving' ||
            result.data.defaultRoleCode == 'GiftSpecialLibraries' ||
            result.data.defaultRoleCode == 'FemalBeneficicareis'

          )

          ) {
            localStorage.setItem('activeRoleCode', result.data.defaultRoleCode);
            let role = this.camalize(result.data.defaultRoleCode)
            let url = `/auth/${role}/home`

            this.router.navigate([`/auth/${role}/home`]);

          }


         else if (this.return != "/") {
            if (environment.appContext === '') {
              window.location.href = this.return;
            }
            else {
              window.location.href = '/' + environment.appContext + this.return;
            }

          }
          else {
            // console.log("wafa");
            localStorage.setItem('activeRoleCode', result.data.defaultRoleCode);
            switch (result.data.defaultRoleCode) {
              case 'Admin':
                this.router.navigate(['/auth/admin/home']);
                break;
              // case 'Employee':
              //     this.router.navigate(['/auth/employee/home']);
              //     break;
              case 'Supplies':
                this.router.navigate(['/auth/supplies/home']);
                break;
              case 'LibraryServices':
                this.router.navigate(['/auth/libraryServices/home']);
                break;
              case 'ProgramsAndEvents':
                this.router.navigate(['/auth/programsAndEvents/home']);
                break;
              case 'UniversityThesises':
                this.router.navigate(['/auth/universityThesises/home']);
                break;
              case 'TechnicalSupport':
                this.router.navigate(['/auth/technicalSupport/home']);
                break;
              case 'TechnicalDepartment':
                this.router.navigate(['/auth/technicalDepartment/home']);
                break;
              case 'FemalBeneficicareis':
                // console.log("before route");
                this.router.navigate(['/auth/femalBeneficicareis/home']);
                break;
              case 'GiftSpecialLibraries':
                this.router.navigate(['/auth/giftSpecialLibraries/home']);
                break;
              case 'PrintingArchiving':
                this.router.navigate(['/auth/printingArchiving/home']);
                break;
              case 'PublicAdminstration':
                this.router.navigate(['/auth/publicAdminstration/home']);
                break;

              case 'MaleLibRelations':
                this.router.navigate(['/auth/maleLibRelations/home']);
                break;
              case 'FemaleLibRelations':
                this.router.navigate(['/auth/femaleLibRelations/home']);
                break;

              // case 'PublicAdminstration-MaleHaramMacciLib-':
              //   this.router.navigate(['/auth/publicAdminstration/home']);
              //   break;
              // case 'PublicAdminstration-FemaleHaramMacciLib-':
              //   this.router.navigate(['/auth/publicAdminstration/home']);
              //   break;
              // case 'PublicAdminstration-HaramMosqueLib-':
              //   this.router.navigate(['/auth/publicAdminstration/home']);
              //   break;

              case 'Visitor':
                this.router.navigate(['auth/user/home']);
                break;
              default:
                this.router.navigate(['/']);
                break;
            }
          }

          this.spinner.hide();
        }
        else {
          this.global.clearMessages();
          this.global.addMessages(result.messages);
          this.handleError(result.messages[0].body);

          this.spinner.hide();
        }
      },
      (error) => {
        this.global.clearMessages();
        this.global.addMessages(error.message);
      },

      () => console.log('Complete')
    )
  }
  handleError(error: any) {
    this.error = error;
  }
}
