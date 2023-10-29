import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private global: GlobalService, private route: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isUserExist = this.global.isUserExist();
    const url = state.url;
    if (!isUserExist || !this.global.user.getValue().roleCode.includes('Admin')) {
      this.route.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
    else{
      if(url.startsWith('/auth/admin/home')){
        return true;
      }
      else if(url.startsWith('/auth/admin/buy-book-form/edit-suggestion')){
        return true;
      }
      else if(url.startsWith('/auth/admin/buy-book-view')){
        return true;
      }
      else if(url.startsWith('/auth/admin/buy-book-archived')){
        return true;
      }
      else if(url.startsWith('/auth/admin/ask-librarian-form/edit-inquiry')){
        return true;
      }
      else if(url.startsWith('/auth/admin/ask-librarian-view')){
        return true;
      }
      else if(url.startsWith('/auth/admin/visit-library-form/edit-visitRequest')){
        return true;
      }
      else if(url.startsWith('/auth/admin/visit-library-generate')){
        return true;
      }
      else if(url.startsWith('/auth/admin/visit-library-schedule')){
        return true;
      }
      else if(url.startsWith('/auth/admin/visit-library-view')){
        return true;
      }
      else if(url.startsWith('/auth/admin/research-retreat-form/edit-researchRequest')){
        return true;
      }
      else if(url.startsWith('/auth/admin/research-retreat-schedule')){
        return true;
      }
      else if(url.startsWith('/auth/admin/research-retreat-generate')){
        return true;
      }
      else if(url.startsWith('/auth/admin/research-retreat-view')){
        return true;
      }
      else if(url.startsWith('/auth/admin/scientific-thesis-form/edit-thesisDepositionRequest')){
        return true;
      }
      else if(url.startsWith('/auth/admin/scientific-thesis-view')){
        return true;
      }
      else if(url.startsWith('/auth/admin/profile')){
        return true;
      }
      else if(url.startsWith('/auth/admin/users')){
        return true;
      }
      else if(url.startsWith('/auth/admin/libraries')){
        return true;
      }
      else if(url.startsWith('/auth/admin/halls')){
        return true;
      }

      this.route.navigate(['/auth/admin/home']);
      return false;
    }
  }
}
