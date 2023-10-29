import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyBookFormComponent } from './buy-book/buy-book-form/buy-book-form.component';
import { BuyBookViewComponent } from './buy-book/buy-book-view/buy-book-view.component';
import { HomeComponent } from './home/home.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { VisitLibraryFormComponent } from './visit-library/visit-library-form/visit-library-form.component';
import { VisitLibraryViewComponent } from './visit-library/visit-library-view/visit-library-view.component';
import { AskLibrarianFormComponent } from './ask-librarian/ask-librarian-form/ask-librarian-form.component';
import { AskLibrarianViewComponent } from './ask-librarian/ask-librarian-view/ask-librarian-view.component';
import { VisitLibraryFollowComponent } from './visit-library/visit-library-follow/visit-library-follow.component';
import { ResearchRetreatFormComponent } from './research-retreat/research-retreat-form/research-retreat-form.component';
import { ScientificThesisFormComponent } from './depositing-scientific-thesis/scientific-thesis-form/scientific-thesis-form.component';
import { ScientificThesisViewComponent } from './depositing-scientific-thesis/scientific-thesis-view/scientific-thesis-view.component';
import { ResearchRetreatViewComponent } from './research-retreat/research-retreat-view/research-retreat-view.component';
import { ResearchRetreatFollowComponent } from './research-retreat/research-retreat-follow/research-retreat-follow.component';
import { ScientificThesisFollowComponent } from './depositing-scientific-thesis/scientific-thesis-follow/scientific-thesis-follow.component';
import { ClientAuthGuard } from '../guard/client-auth.guard';
import { AuthGuard } from '../guard/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { BuyBookArchivedComponent } from './buy-book/buy-book-archived/buy-book-archived.component';
import { AskLibrarianArchivedComponent } from './ask-librarian/ask-librarian-archived/ask-librarian-archived.component';
import { VisitLibraryArchivedComponent } from './visit-library/visit-library-archived/visit-library-archived.component';
import { ResearchRetreatArchivedComponent } from './research-retreat/research-retreat-archived/research-retreat-archived.component';
import { ScientificThesisArchivedComponent } from './depositing-scientific-thesis/scientific-thesis-archived/scientific-thesis-archived.component';
import { NotAuthComponent } from './not-auth/not-auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BookGiftViewComponent } from './book-gift/book-gift-view/book-gift-view.component';
import { BookGiftFormComponent } from './book-gift/book-gift-form/book-gift-form.component';
import { RequestGiftViewComponent } from './book-request-a-gift/request-gift-view/request-gift-view.component';
import { RequestGiftFormComponent } from './book-request-a-gift/request-gift-form/request-gift-form.component';
import { RequestGiftBookListComponent } from './book-request-a-gift/request-gift-book-list/request-gift-book-list.component';
import { BookGiftFollowComponent } from './book-gift/book-gift-follow/book-gift-follow.component';
import { BookGiftArchivedComponent } from './book-gift/book-gift-archived/book-gift-archived.component';
import { RequestGiftArchivedComponent } from './book-request-a-gift/request-gift-archived/request-gift-archived.component';
import { RequestGiftFollowComponent } from './book-request-a-gift/request-gift-follow/request-gift-follow.component';
import { ManuscriptRequestViewComponent } from './manuscript-request/manuscript-request-view/manuscript-request-view.component';
import { ManuscriptRequestFormComponent } from './manuscript-request/manuscript-request-form/manuscript-request-form.component';
import { CopyBookViewComponent } from './copy-book/copy-book-view/copy-book-view.component';
import { CopyBookFormComponent } from './copy-book/copy-book-form/copy-book-form.component';
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

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'buy-book-form', component: BuyBookFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'buy-book-form/edit-suggestion/:id', component: BuyBookFormComponent, canActivate: [ClientAuthGuard]},
  {path: 'buy-book-view', component: BuyBookViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'buy-book-archived', component: BuyBookArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'ask-librarian-form', component: AskLibrarianFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'ask-librarian-form/edit-inquiry/:id', component: AskLibrarianFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'ask-librarian-view', component: AskLibrarianViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'ask-librarian-archived', component: AskLibrarianArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'visit-library-form', component: VisitLibraryFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'visit-library-form/edit-visitRequest/:id', component: VisitLibraryFormComponent, canActivate: [ClientAuthGuard]} ,
  //{path: 'visit-library-follow', component: VisitLibraryFollowComponent   } ,
  {path: 'visit-library-follow/follow-visitRequest/:id', component: VisitLibraryFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'visit-library-view', component: VisitLibraryViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'visit-library-archived', component: VisitLibraryArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'research-retreat-form', component: ResearchRetreatFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'research-retreat-form/edit-researchRequest/:id', component: ResearchRetreatFormComponent, canActivate: [ClientAuthGuard]} ,
  //{path: 'research-retreat-follow', component: ResearchRetreatFollowComponent   } ,
  {path: 'research-retreat-follow/follow-researchRequest/:id', component: ResearchRetreatFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'research-retreat-view', component: ResearchRetreatViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'research-retreat-archived', component: ResearchRetreatArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'scientific-thesis-form', component: ScientificThesisFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'scientific-thesis-form/edit-thesisDepositionRequest/:id', component: ScientificThesisFormComponent, canActivate: [ClientAuthGuard]} ,
  // {path: 'scientific-thesis-follow', component: ScientificThesisFollowComponent   } ,
  {path: 'scientific-thesis-follow/follow-thesisDepositionRequest/:id', component: ScientificThesisFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'scientific-thesis-view', component: ScientificThesisViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'scientific-thesis-archived', component: ScientificThesisArchivedComponent, canActivate: [ClientAuthGuard]} ,

  {path: 'my-orders', component: MyOrdersComponent, canActivate: [ClientAuthGuard]} ,


  {path: 'profile', component: ProfileComponent, canActivate:[ClientAuthGuard]},

  {path: 'book-gift-view', component: BookGiftViewComponent, canActivate:[ClientAuthGuard]},
  {path: 'book-gift-archived', component: BookGiftArchivedComponent, canActivate:[ClientAuthGuard]},
  {path: 'book-gift-form', component: BookGiftFormComponent, canActivate:[ClientAuthGuard]},
  {path: 'book-gift-form/edit-giftRequest/:id', component: BookGiftFormComponent, canActivate:[ClientAuthGuard]},
  {path: 'book-gift-follow/follow-giftRequest/:id', component: BookGiftFollowComponent, canActivate:[ClientAuthGuard]},
  {path: 'request-gift-view', component: RequestGiftViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'request-gift-form', component: RequestGiftBookListComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'request-gift-archived', component: RequestGiftArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'request-gift-form/edit-requestgift/:id', component: RequestGiftBookListComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'request-gift-form/request-giftfollow/:id', component: RequestGiftFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'manuscript-request-view', component: ManuscriptRequestViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'manuscript-request-form', component: ManuscriptRequestFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'manuscript-request-follow/:id', component: ManuscriptRequestFollowComponent, canActivate: [ClientAuthGuard]} ,

  {path: 'manuscript-request-archived', component: ManuscriptRequestArchivedComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'manuscript-request-form/edit-manuscript-request/:id', component: ManuscriptRequestFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'copy-book-view', component: CopyBookViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'copy-book-form', component: CopyBookFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'copy-book-form/edit/:id', component: CopyBookFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'copy-book-follow/:id', component: CopyBookFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'copy-book-archived', component: CopyBookArchivedComponent, canActivate: [ClientAuthGuard]} ,


  {path: 'libraries-exchange-view', component: LibrariesExchangeViewComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'libraries-exchange-form', component: LibrariesExchangeFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'libraries-exchange-form/edit/:id', component: LibrariesExchangeFormComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'libraries-exchange-follow/:id', component: LibrariesExchangeFollowComponent, canActivate: [ClientAuthGuard]} ,
  {path: 'libraries-exchange-archived', component: LibraryExchangeArchivedComponent, canActivate: [ClientAuthGuard]} ,

  {path: 'subscribe-list', component: SubscribeListComponent, canActivate: [ClientAuthGuard]} ,

  {path: 'not-auth', component: NotAuthComponent} ,
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
