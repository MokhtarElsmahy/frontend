import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/modules/shared.module';
import { BuyBookFormComponent } from './buy-book/buy-book-form/buy-book-form.component';
import { BuyBookViewComponent } from './buy-book/buy-book-view/buy-book-view.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { DataTablesModule } from 'angular-datatables';
import { VisitLibraryFormComponent } from './visit-library/visit-library-form/visit-library-form.component';
import { VisitLibraryViewComponent } from './visit-library/visit-library-view/visit-library-view.component';
import { AskLibrarianFormComponent } from './ask-librarian/ask-librarian-form/ask-librarian-form.component';
import { AskLibrarianViewComponent } from './ask-librarian/ask-librarian-view/ask-librarian-view.component';
import { RouterModule } from '@angular/router';
import { VisitLibraryFollowComponent } from './visit-library/visit-library-follow/visit-library-follow.component';
import { ResearchRetreatFormComponent } from './research-retreat/research-retreat-form/research-retreat-form.component';
import { ScientificThesisFormComponent } from './depositing-scientific-thesis/scientific-thesis-form/scientific-thesis-form.component';
import { ScientificThesisViewComponent } from './depositing-scientific-thesis/scientific-thesis-view/scientific-thesis-view.component';
import { ResearchRetreatViewComponent } from './research-retreat/research-retreat-view/research-retreat-view.component';
import { ResearchRetreatFollowComponent } from './research-retreat/research-retreat-follow/research-retreat-follow.component';
import { ScientificThesisFollowComponent } from './depositing-scientific-thesis/scientific-thesis-follow/scientific-thesis-follow.component';
import { ProfileComponent } from './profile/profile.component';
import { BuyBookArchivedComponent } from './buy-book/buy-book-archived/buy-book-archived.component';
import { BuyBookPrintComponent } from './buy-book/buy-book-print/buy-book-print.component';
import { AskLibrarianArchivedComponent } from './ask-librarian/ask-librarian-archived/ask-librarian-archived.component';
import { VisitLibraryArchivedComponent } from './visit-library/visit-library-archived/visit-library-archived.component';
import { ResearchRetreatArchivedComponent } from './research-retreat/research-retreat-archived/research-retreat-archived.component';
import { ScientificThesisArchivedComponent } from './depositing-scientific-thesis/scientific-thesis-archived/scientific-thesis-archived.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookGiftViewComponent } from './book-gift/book-gift-view/book-gift-view.component';
import { BookGiftFormComponent } from './book-gift/book-gift-form/book-gift-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BookGiftListComponent } from './book-gift/book-gift-list/book-gift-list.component';
import { RequestGiftViewComponent } from './book-request-a-gift/request-gift-view/request-gift-view.component';
import { RequestGiftFormComponent } from './book-request-a-gift/request-gift-form/request-gift-form.component';
import { RequestGiftBookListComponent } from './book-request-a-gift/request-gift-book-list/request-gift-book-list.component';
import { RequestGiftArchivedComponent } from './book-request-a-gift/request-gift-archived/request-gift-archived.component';
import { RequestGiftFollowComponent } from './book-request-a-gift/request-gift-follow/request-gift-follow.component';
import { BookGiftFollowComponent } from './book-gift/book-gift-follow/book-gift-follow.component';
import { BookGiftArchivedComponent } from './book-gift/book-gift-archived/book-gift-archived.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ManuscriptRequestViewComponent } from './manuscript-request/manuscript-request-view/manuscript-request-view.component';
import { ManuscriptRequestFormComponent } from './manuscript-request/manuscript-request-form/manuscript-request-form.component';
import { CopyBookFormComponent } from './copy-book/copy-book-form/copy-book-form.component';
import { CopyBookViewComponent } from './copy-book/copy-book-view/copy-book-view.component';
import { BookListComponent } from './copy-book/book-list/book-list.component';
import { CopyBookFollowComponent } from './copy-book/copy-book-follow/copy-book-follow.component';
import { ManuscriptRequestFollowComponent } from './manuscript-request/manuscript-request-follow/manuscript-request-follow.component';
import { LibrariesExchangeViewComponent } from './libraries-exchange/libraries-exchange-view/libraries-exchange-view.component';
import { LibrariesExchangeFormComponent } from './libraries-exchange/libraries-exchange-form/libraries-exchange-form.component';
import { AddExchangeComponent } from './libraries-exchange/add-exchange/add-exchange.component';
import { LibrariesExchangeFollowComponent } from './libraries-exchange/libraries-exchange-follow/libraries-exchange-follow.component';
import { ManuscriptRequestArchivedComponent } from './manuscript-request/manuscript-request-archived/manuscript-request-archived.component';
import { CopyBookArchivedComponent } from './copy-book/copy-book-archived/copy-book-archived.component';
import { LibraryExchangeArchivedComponent } from './libraries-exchange/library-exchange-archived/library-exchange-archived.component';
import { SubscribeListComponent } from './subscribe/subscribe-list/subscribe-list.component';
import { SubscribeFormComponent } from './subscribe/subscribe-form/subscribe-form.component';


@NgModule({
  declarations: [
    HomeComponent,
    BuyBookFormComponent,
    BuyBookViewComponent,
    BuyBookArchivedComponent,
    BuyBookPrintComponent,
    AskLibrarianFormComponent,
    AskLibrarianViewComponent,
    AskLibrarianArchivedComponent,
    VisitLibraryFormComponent,
    VisitLibraryViewComponent,
    VisitLibraryFollowComponent,
    VisitLibraryArchivedComponent,
    ResearchRetreatFormComponent,
    ResearchRetreatViewComponent,
    ResearchRetreatFollowComponent,
    ResearchRetreatArchivedComponent,
    ScientificThesisFormComponent,
    ScientificThesisViewComponent,
    ScientificThesisFollowComponent,
    ScientificThesisArchivedComponent,
    MyOrdersComponent,
    ProfileComponent,
    NotAuthComponent,
    PageNotFoundComponent,
    BookGiftViewComponent,
    BookGiftFormComponent,
    BookGiftListComponent,
    RequestGiftViewComponent,
    RequestGiftFormComponent,
    RequestGiftBookListComponent,
    RequestGiftArchivedComponent,
    RequestGiftFollowComponent,
    BookGiftFollowComponent,
    BookGiftArchivedComponent,
    ManuscriptRequestViewComponent,
    ManuscriptRequestFormComponent,
    CopyBookFormComponent,
    CopyBookViewComponent,
    BookListComponent,
    CopyBookFollowComponent,
    ManuscriptRequestFollowComponent,
    LibrariesExchangeViewComponent,
    LibrariesExchangeFormComponent,
    AddExchangeComponent,
    LibrariesExchangeFollowComponent,
    ManuscriptRequestArchivedComponent,
    CopyBookArchivedComponent,
    LibraryExchangeArchivedComponent,
    SubscribeListComponent,
    SubscribeFormComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    UserRoutingModule,
    SharedModule,
    DataTablesModule,
    NgbModule,
    ReactiveFormsModule ,
    NgMultiSelectDropDownModule.forRoot()


  ],
  providers: [
    NgbActiveModal,
  ]
})
export class UserModule { }
