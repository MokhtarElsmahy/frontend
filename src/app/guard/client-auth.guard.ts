import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class ClientAuthGuard implements CanActivate {

  constructor(private global: GlobalService, private route: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isUserExist = this.global.isUserExist();
    const url = state.url;
    if (!isUserExist || !this.global.user.getValue().roleCode.includes('Visitor')) {
      this.route.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
    else{
      if(url.startsWith('/auth/user/home')){
        return true;
      }
      else if(url.startsWith('/auth/user/buy-book-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/buy-book-form/edit-suggestion')){
        return true;
      }
      else if(url.startsWith('/auth/user/buy-book-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/buy-book-archived')){
        return true;
      }
      //************************* */
      else if(url.startsWith('/auth/user/ask-librarian-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/ask-librarian-form/edit-inquiry')){
        return true;
      }
      else if(url.startsWith('/auth/user/ask-librarian-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/ask-librarian-archived')){
        return true;
      }
       //************************* */
      else if(url.startsWith('/auth/user/visit-library-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/visit-library-form/edit-visitRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/visit-library-follow/follow-visitRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/visit-library-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/visit-library-archived')){
        return true;
      }
       //************************* */
      else if(url.startsWith('/auth/user/research-retreat-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/research-retreat-form/edit-researchRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/research-retreat-follow/follow-researchRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/research-retreat-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/research-retreat-archived')){
        return true;
      }
       //************************* */
      else if(url.startsWith('/auth/user/scientific-thesis-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/scientific-thesis-form/edit-thesisDepositionRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/scientific-thesis-follow/follow-thesisDepositionRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/scientific-thesis-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/scientific-thesis-archived')){
        return true;
      }
       //************************* */
      else if(url.startsWith('/auth/user/book-gift-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/book-gift-form/edit-giftRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/book-gift-follow/follow-giftRequest')){
        return true;
      }
      else if(url.startsWith('/auth/user/book-gift-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/book-gift-archived')){
        return true;
      }
      //****************************** */
      else if(url.startsWith('/auth/user/request-gift-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-archived')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-form/request-giftfollow')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-form/edit-requestgift')){
        return true;
      }
      //********************************* */

      else if(url.startsWith('/auth/user/manuscript-request-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/manuscript-request-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/manuscript-request-follow')){
        return true;
      }
      else if(url.startsWith('/auth/user/manuscript-request-archived')){
        return true;
      }
      else if(url.startsWith('/auth/user/manuscript-request-form/edit-manuscript-request')){
        return true;
      }
      //********************************************** */

      else if(url.startsWith('/auth/user/copy-book-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/copy-book-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/copy-book-follow')){
        return true;
      }
      else if(url.startsWith('/auth/user/copy-book-form/edit')){
        return true;
      }
      else if(url.startsWith('/auth/user/copy-book-archived')){
        return true;
      }

       //********************************************** */

       else if(url.startsWith('/auth/user/libraries-exchange-form')){
        return true;
      }
      else if(url.startsWith('/auth/user/libraries-exchange-follow')){
        return true;
      }
      else if(url.startsWith('/auth/user/libraries-exchange-view')){
        return true;
      }
      else if(url.startsWith('/auth/user/libraries-exchange-form/edit')){
        return true;
      }
      else if(url.startsWith('/auth/user/libraries-exchange-archived')){
        return true;
      }

       //********************************************** */

       else if(url.startsWith('/auth/user/subscribe-list')){
        return true;
      }
       //********************************************** */

      else if(url.startsWith('/auth/user/my-orders')){
        return true;
      }
      else if(url.startsWith('/auth/user/profile')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-form/edit-requestgift/')){
        return true;
      }
      else if(url.startsWith('/auth/user/request-gift-form/request-giftfollow')){
        return true;
      }

      this.route.navigate(['/auth/user/home']);
      return false;
    }
  }
}
