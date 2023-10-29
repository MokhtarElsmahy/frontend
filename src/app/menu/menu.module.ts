import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { VisitorMenuComponent } from './visitor-menu/visitor-menu.component';
import { EmployeeMenuComponent } from './employee-menu/employee-menu.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';


@NgModule({
  declarations: [
    VisitorMenuComponent,
    EmployeeMenuComponent,
    AdminMenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
