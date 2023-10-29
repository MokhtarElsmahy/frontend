import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { HomeComponent } from './home/home.component';
import { BuyBookFormComponent } from './buy-book/buy-book-form/buy-book-form.component';
import { SharedModule } from '../shared/modules/shared.module';
import { VisitLibraryViewComponent } from './visit-library/visit-library-view/visit-library-view.component';
import { VisitLibraryFormComponent } from './visit-library/visit-library-form/visit-library-form.component';
import { AskLibrarianViewComponent } from './ask-library/ask-librarian-view/ask-librarian-view.component';
import { AskLibrarianFormComponent } from './ask-library/ask-librarian-form/ask-librarian-form.component';
import { BuyBookViewComponent } from './buy-book/buy-book-view/buy-book-view.component';
import { VisitLibraryScheduleComponent } from './visit-library/visit-library-schedule/visit-library-schedule.component';
import { VisitLibraryGenerateComponent } from './visit-library/visit-library-generate/visit-library-generate.component';
import { AddAppointmentComponent } from './visit-library/add-appointment/add-appointment.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { ResearchRetreatFormComponent } from './research-retreat/research-retreat-form/research-retreat-form.component';
import { ResearchRetreatScheduleComponent } from './research-retreat/research-retreat-schedule/research-retreat-schedule.component';
import { ResearchRetreatGenerateComponent } from './research-retreat/research-retreat-generate/research-retreat-generate.component';
import { AddRetreatAppointmentComponent } from './research-retreat/add-retreat-appointment/add-retreat-appointment.component';
import { ResearchRetreatViewComponent } from './research-retreat/research-retreat-view/research-retreat-view.component';
import { ScientificThesisFormComponent } from './depositing-scientific-thesis/scientific-thesis-form/scientific-thesis-form.component';
import { ScientificThesisViewComponent } from './depositing-scientific-thesis/scientific-thesis-view/scientific-thesis-view.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyBookArchivedComponent } from './buy-book/buy-book-archived/buy-book-archived.component';
import { AddPeriodsComponent } from './visit-library/add-periods/add-periods.component';
import { VisitLibraryArchivedComponent } from './visit-library/visit-library-archived/visit-library-archived.component';
import { AskLibrarianArchivedComponent } from './ask-library/ask-librarian-archived/ask-librarian-archived.component';
import { ScientificThesisArchivedComponent } from './depositing-scientific-thesis/scientific-thesis-archived/scientific-thesis-archived.component';
import { ResearchRetreatArchivedComponent } from './research-retreat/research-retreat-archived/research-retreat-archived.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookGiftViewComponent } from './book-gift/book-gift-view/book-gift-view.component';
import { BookGiftFormComponent } from './book-gift/book-gift-form/book-gift-form.component';
import { BookGiftListComponent } from './book-gift/book-gift-list/book-gift-list.component';
import { RequestGiftFormComponent } from './book-request-a-gift/request-gift-form/request-gift-form.component';
import { RequestGiftViewComponent } from './book-request-a-gift/request-gift-view/request-gift-view.component';
import { BookGiftArchivedComponent } from './book-gift/book-gift-archived/book-gift-archived.component';
import { ManuscriptRequestViewComponent } from './manuscript-request/manuscript-request-view/manuscript-request-view.component';
import { ManuscriptRequestFormComponent } from './manuscript-request/manuscript-request-form/manuscript-request-form.component';
import { CopyBookViewComponent } from './copy-book/copy-book-view/copy-book-view.component';
import { CopyBookFormComponent } from './copy-book/copy-book-form/copy-book-form.component';
import { LibrariesExchangeFormComponent } from './libraries-exchange/libraries-exchange-form/libraries-exchange-form.component';
import { LibrariesExchangeViewComponent } from './libraries-exchange/libraries-exchange-view/libraries-exchange-view.component';
import { ManuscriptRequestArchivedComponent } from './manuscript-request/manuscript-request-archived/manuscript-request-archived.component';
import { CopyBookArchivedComponent } from './copy-book/copy-book-archived/copy-book-archived.component';
import { LibrariesExchangeArchivedComponent } from './libraries-exchange/libraries-exchange-archived/libraries-exchange-archived.component';
import { SubscribeListComponent } from './subscribe/subscribe-list/subscribe-list.component';
import { SubscribeFormComponent } from './subscribe/subscribe-form/subscribe-form.component';
import { RequestGiftArchivedComponent } from './book-request-a-gift/request-gift-archived/request-gift-archived.component';


@NgModule({
  declarations: [
    HomeComponent,
    BuyBookFormComponent,
    BuyBookViewComponent,
    BuyBookArchivedComponent,
    AskLibrarianFormComponent,
    AskLibrarianViewComponent,
    AskLibrarianArchivedComponent,
    VisitLibraryFormComponent,
    VisitLibraryViewComponent,
    VisitLibraryArchivedComponent,
    VisitLibraryScheduleComponent,
    VisitLibraryGenerateComponent,
    AddAppointmentComponent,
    AddPeriodsComponent,
    ResearchRetreatFormComponent,
    ResearchRetreatScheduleComponent,
    ResearchRetreatGenerateComponent,
    ResearchRetreatViewComponent,
    ResearchRetreatArchivedComponent,
    AddRetreatAppointmentComponent,
    ScientificThesisFormComponent,
    ScientificThesisViewComponent,
    ScientificThesisArchivedComponent,
    ProfileComponent,
    NotAuthComponent,
    PageNotFoundComponent,
    BookGiftViewComponent,
    BookGiftFormComponent,
    BookGiftListComponent,
    RequestGiftFormComponent,
    RequestGiftViewComponent,
    BookGiftArchivedComponent,
    ManuscriptRequestViewComponent,
    ManuscriptRequestFormComponent,
    CopyBookViewComponent,
    CopyBookFormComponent,
    LibrariesExchangeFormComponent,
    LibrariesExchangeViewComponent,
    ManuscriptRequestArchivedComponent,
    CopyBookArchivedComponent,
    LibrariesExchangeArchivedComponent,
    SubscribeListComponent,
    SubscribeFormComponent,
    RequestGiftArchivedComponent,
    
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    SharedModule,
    NgbModule,
    DataTablesModule,

  ],
  providers: [
    NgbActiveModal,
  ]
})
export class EmployeeModule { }
