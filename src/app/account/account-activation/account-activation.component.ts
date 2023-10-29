import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountActivationVM } from 'src/app/shared/models/VM/AccountActivationVM';
import { AccountService } from 'src/app/shared/services/account.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss']
})
export class AccountActivationComponent implements OnInit {

  accountActivationModel: AccountActivationVM = new AccountActivationVM();

  constructor(public global: GlobalService,
    private accountService: AccountService,
    private route:ActivatedRoute,
    private router : Router, 
    private spinner: NgxSpinnerService) {
      route.queryParams.subscribe(params=>{
        this.accountActivationModel.email = params['emailKey'];
        this.accountActivationModel.activationToken = params['token'];
      });
  }
  
  ngOnInit(): void {
    this.activateAccount();
  }

  activateAccount(){
    this.accountService.activateAccount(this.accountActivationModel).then((res) => {
      let result = res as boolean;

      if(result){
        this.router.navigateByUrl("/login");
      }
      else{
        this.router.navigateByUrl("/page-not-found");
      }
    });
  }
}
