import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminDashboardRoutingModule } from './home-dashboard-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from "angular-datatables";
import { HomeComponent } from './home/home.component';
import { HomeSamplesComponent } from './home-samples/home-samples.component';
import { SharedModule } from '../shared/modules/shared.module';
import { VisitorMenuComponent } from '../menu/visitor-menu/visitor-menu.component';
import { EmployeeMenuComponent } from '../menu/employee-menu/employee-menu.component';
import { AdminMenuComponent } from '../menu/admin-menu/admin-menu.component';


@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent,
    HomeSamplesComponent,
    FooterComponent,
    HomeComponent,
    VisitorMenuComponent,
    EmployeeMenuComponent,
    AdminMenuComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    FormsModule,
    CKEditorModule,
    DataTablesModule,
    NgbModule,
    SharedModule,
  ],
  exports: [],
  bootstrap: [HomeComponent]

})
export class HomeDashboardModule { }
