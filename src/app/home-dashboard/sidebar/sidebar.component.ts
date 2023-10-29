import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
declare function sidebar(): void;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user:any ;
  @Input() accType: string;

  constructor(  private router : Router ,public global: GlobalService) { }

  ngOnInit(): void {

    this.user = this.global.getUserFromLocalStorage();
   // console.log(this.user);
    // console.log(this.accType);
  }

  ngAfterViewInit() {
    sidebar();
  }
  logout(event:MouseEvent){
    event.preventDefault();
    this.global.resetUser();
    this.router.navigateByUrl('admin/login');
  }
}
