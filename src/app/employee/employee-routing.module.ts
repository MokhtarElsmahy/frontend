import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BuyBookFormComponent } from './buy-book/buy-book-form/buy-book-form.component';
import { BuyBookViewComponent } from './buy-book/buy-book-view/buy-book-view.component';
import { VisitLibraryViewComponent } from './visit-library/visit-library-view/visit-library-view.component';
import { VisitLibraryFormComponent } from './visit-library/visit-library-form/visit-library-form.component';
import { AskLibrarianViewComponent } from './ask-library/ask-librarian-view/ask-librarian-view.component';
import { AskLibrarianFormComponent } from './ask-library/ask-librarian-form/ask-librarian-form.component';
import { VisitLibraryScheduleComponent } from './visit-library/visit-library-schedule/visit-library-schedule.component';
import { VisitLibraryGenerateComponent } from './visit-library/visit-library-generate/visit-library-generate.component';
import { ResearchRetreatFormComponent } from './research-retreat/research-retreat-form/research-retreat-form.component';
import { ResearchRetreatScheduleComponent } from './research-retreat/research-retreat-schedule/research-retreat-schedule.component';
import { ResearchRetreatGenerateComponent } from './research-retreat/research-retreat-generate/research-retreat-generate.component';
import { ResearchRetreatViewComponent } from './research-retreat/research-retreat-view/research-retreat-view.component';
import { ScientificThesisFormComponent } from './depositing-scientific-thesis/scientific-thesis-form/scientific-thesis-form.component';
import { ScientificThesisViewComponent } from './depositing-scientific-thesis/scientific-thesis-view/scientific-thesis-view.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyBookArchivedComponent } from './buy-book/buy-book-archived/buy-book-archived.component';
import { AddPeriodsComponent } from './visit-library/add-periods/add-periods.component';
import { EmployeeAuthGuard } from '../guard/employee-auth.guard';
import { AskLibrarianArchivedComponent } from './ask-library/ask-librarian-archived/ask-librarian-archived.component';
import { VisitLibraryArchivedComponent } from './visit-library/visit-library-archived/visit-library-archived.component';
import { ResearchRetreatArchivedComponent } from './research-retreat/research-retreat-archived/research-retreat-archived.component';
import { ScientificThesisArchivedComponent } from './depositing-scientific-thesis/scientific-thesis-archived/scientific-thesis-archived.component';
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
import { ManuscriptRequestArchivedComponent } from './manuscript-request/manuscript-request-archived/manuscript-request-archived.component';
import { CopyBookArchivedComponent } from './copy-book/copy-book-archived/copy-book-archived.component';

import { LibrariesExchangeFormComponent } from './libraries-exchange/libraries-exchange-form/libraries-exchange-form.component';
import { LibrariesExchangeViewComponent } from './libraries-exchange/libraries-exchange-view/libraries-exchange-view.component';
import { LibrariesExchangeArchivedComponent } from './libraries-exchange/libraries-exchange-archived/libraries-exchange-archived.component';
import { SubscribeListComponent } from './subscribe/subscribe-list/subscribe-list.component';
import { SubscribeFormComponent } from './subscribe/subscribe-form/subscribe-form.component';
import { RequestGiftArchivedComponent } from './book-request-a-gift/request-gift-archived/request-gift-archived.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [EmployeeAuthGuard]} ,
  // {path: 'buy-book-form', component: BuyBookFormComponent   } ,
  {path: 'buy-book-form/edit-suggestion/:id', component: BuyBookFormComponent, canActivate: [EmployeeAuthGuard]},
  {path: 'buy-book-view', component: BuyBookViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'buy-book-archived', component: BuyBookArchivedComponent, canActivate: [EmployeeAuthGuard]} ,
  // {path: 'ask-librarian-form', component: AskLibrarianFormComponent   } ,
  {path: 'ask-librarian-form/edit-inquiry/:id', component: AskLibrarianFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'ask-librarian-view', component: AskLibrarianViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'ask-librarian-archived', component: AskLibrarianArchivedComponent, canActivate: [EmployeeAuthGuard]} ,
  // {path: 'visit-library-form', component: VisitLibraryFormComponent   } ,
  {path: 'visit-library-form/edit-visitRequest/:id', component: VisitLibraryFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'visit-library-generate', component: VisitLibraryGenerateComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'visit-library-schedule', component: VisitLibraryScheduleComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'visit-library-view', component: VisitLibraryViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'visit-library-archived', component: VisitLibraryArchivedComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'periods', component: AddPeriodsComponent} ,
  // {path: 'research-retreat-form', component: ResearchRetreatFormComponent   } ,
  {path: 'research-retreat-form/edit-researchRequest/:id', component: ResearchRetreatFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'research-retreat-schedule', component: ResearchRetreatScheduleComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'research-retreat-generate', component: ResearchRetreatGenerateComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'research-retreat-view', component: ResearchRetreatViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'research-retreat-archived', component: ResearchRetreatArchivedComponent, canActivate: [EmployeeAuthGuard]} ,
  // {path: 'scientific-thesis-form', component: ScientificThesisFormComponent   } ,
  {path: 'scientific-thesis-form/edit-thesisDepositionRequest/:id', component: ScientificThesisFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'scientific-thesis-view', component: ScientificThesisViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'scientific-thesis-archived', component: ScientificThesisArchivedComponent, canActivate: [EmployeeAuthGuard]} ,

  {path: 'book-gift-view', component: BookGiftViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'book-gift-form/edit-giftRequest/:id', component: BookGiftFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'book-gift-list/:id', component: BookGiftListComponent, canActivate: [EmployeeAuthGuard]},
  {path: 'book-gift-archived', component: BookGiftArchivedComponent, canActivate: [EmployeeAuthGuard]},

  {path: 'request-gift-view', component: RequestGiftViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'request-gift-form/:id', component: RequestGiftFormComponent, canActivate: [EmployeeAuthGuard]} ,
 {path: 'request-gift-archived', component: RequestGiftArchivedComponent, canActivate: [EmployeeAuthGuard]} ,

  {path: 'manuscript-request-view', component: ManuscriptRequestViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'manuscript-request-form/:id', component: ManuscriptRequestFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'manuscript-request-archived', component: ManuscriptRequestArchivedComponent, canActivate: [EmployeeAuthGuard]} ,

  {path: 'copy-book-view', component: CopyBookViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'copy-book-form', component: CopyBookFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'copy-book-form/:id', component: CopyBookFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'copy-book-archived', component: CopyBookArchivedComponent, canActivate: [EmployeeAuthGuard]} ,

  
  {path: 'libraries-exchange-view', component: LibrariesExchangeViewComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'libraries-exchange-archived', component: LibrariesExchangeArchivedComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'libraries-exchange-form', component: LibrariesExchangeFormComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'libraries-exchange-form/:id', component: LibrariesExchangeFormComponent, canActivate: [EmployeeAuthGuard]} ,

  {path: 'subscribe-list', component: SubscribeListComponent, canActivate: [EmployeeAuthGuard]} ,
  {path: 'subscribe-form/:id', component: SubscribeFormComponent, canActivate: [EmployeeAuthGuard]} ,
  
  {path: 'profile', component: ProfileComponent, canActivate:[EmployeeAuthGuard]} ,
  
  {path: 'not-auth', component: NotAuthComponent} ,
  {path: '**', component: PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
