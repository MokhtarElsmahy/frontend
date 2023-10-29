import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/modules/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgToggleModule } from 'ng-toggle-button';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { HallsComponent } from './halls/halls.component';
import { LibraryFormComponent } from './library-form/library-form.component';
import { HallFormComponent } from './hall-form/hall-form.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    UsersComponent,
    LibrariesComponent,
    HallsComponent,
    LibraryFormComponent,
    HallFormComponent,
    UsersFormComponent,
    HomeComponent,
    ProfileComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    DataTablesModule,
    NgToggleModule,
    NgbModule,
    DataTablesModule,
  ],
  providers: [
    NgbActiveModal,
  ]
})
export class AdminModule { }
