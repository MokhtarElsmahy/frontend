import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  employeesCount: number;
  visitorsCount: number;
  requestsCount: number;

  constructor(private userService: UserService, 
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getSystemEmployeesCount();
    this.getSystemVisitorsCount();
    this.getSystemRequestsCount();
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  getSystemEmployeesCount(){
    this.userService.getSystemEmployeesCount().then((res) => {
      let result = res as number;

      this.employeesCount = result;
    });
  }

  getSystemVisitorsCount(){
    this.userService.getSystemVisitorsCount().then((res) => {
      let result = res as number;

      this.visitorsCount = result;
    });
  }

  getSystemRequestsCount(){
    this.userService.getNumberOfAllSystemRequests().then((res) => {
      let result = res as number;

      this.requestsCount = result;
    });
  }

}
