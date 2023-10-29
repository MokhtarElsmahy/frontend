import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAuthGuard implements CanActivate {

  constructor(private global: GlobalService, private route: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isUserExist = this.global.isUserExist();
    const url = state.url;
    let currentUserRoles = this.global.user.getValue().roleCode;
    if (!isUserExist || 
      (!currentUserRoles.includes('Employee') && !currentUserRoles.includes('Supplies')
      && !currentUserRoles.includes('LibraryServices') && !currentUserRoles.includes('ProgramsAndEvents') 
      && !currentUserRoles.includes('UniversityThesises') && !currentUserRoles.includes('TechnicalSupport')
      && !currentUserRoles.includes('TechnicalDepartment') && !currentUserRoles.includes('PublicAdminstration')
      && !currentUserRoles.includes('PrintingArchiving') && !currentUserRoles.includes('GiftSpecialLibraries')
      && !currentUserRoles.includes('FemalBeneficicareis')
      && !currentUserRoles.includes('MaleLibRelations')
      && !currentUserRoles.includes('FemaleLibRelations')
      
      
      
      
      )) {
      this.route.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });
      return false;
    }
    else{
      if(url.startsWith('/auth/supplies/home') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/supplies/buy-book-form/edit-suggestion') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/supplies/buy-book-view') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/supplies/buy-book-archived') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/supplies/profile') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/profile') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/maleLibRelations/profile') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/femaleLibRelations/profile') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/femalBeneficicareis/profile') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      else if(url.startsWith('/auth/printingArchiving/profile') && currentUserRoles.includes('PrintingArchiving')){
        return true;
      }
      else if(url.startsWith('/auth/technicalDepartment/profile') && currentUserRoles.includes('TechnicalDepartment')){
        return true;
      }
      else if(url.startsWith('/auth/giftSpecialLibraries/profile') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/libraryServices/home') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/ask-librarian-view') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/ask-librarian-archived') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-form/edit-researchRequest') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-schedule') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-generate') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-view') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-archived') && currentUserRoles.includes('LibraryServices')){
        return true;
      } 
      
      //******************************* */
      else if(url.startsWith('/auth/libraryServices/research-retreat-form/edit-researchRequest') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-schedule') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-generate') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      } 
      //******************************* */
      else if(url.startsWith('/auth/libraryServices/book-gift-form/edit-giftRequest')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/book-gift-view')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/book-gift-list')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/book-gift-archived')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/profile') && currentUserRoles.includes('LibraryServices')){
        return true;
      }
      if(url.startsWith('/auth/programsAndEvents/home') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }

     

      if(url.startsWith('/auth/publicAdminstration/home') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      
      }
      else if(url.startsWith('/auth/publicAdminstration/ask-librarian-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      if(url.startsWith('/auth/publicAdminstration/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      if(url.startsWith('/auth/publicAdminstration/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/copy-book-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/copy-book-form') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/copy-book-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/visit-library-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/publicAdminstration/research-retreat-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      
      

      else if(url.startsWith('/auth/programsAndEvents/visit-library-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-schedule') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-generate') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

////////////************************ */
      else if(url.startsWith('/auth/programsAndEvents/visit-library-view') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-schedule') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-generate') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }

      else if(url.startsWith('/auth/programsAndEvents/visit-library-view') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-schedule') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-generate') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }


      else if(url.startsWith('/auth/programsAndEvents/periods') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }


      else if(url.startsWith('/auth/libraryServices/research-retreat-form/edit-researchRequest') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-schedule') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-generate') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/research-retreat-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      else if(url.startsWith('/auth/publicAdminstration/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      else if(url.startsWith('/auth/libraryServices/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/technicalSupport/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      else if(url.startsWith('/auth/libraryServices/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }


      // ******************************

      if(url.startsWith('/auth/printingArchiving/home') && currentUserRoles.includes('PrintingArchiving')){
        return true;
      }
      
      if(url.startsWith('/auth/printingArchiving/manuscript-request-view') && currentUserRoles.includes('PrintingArchiving')){
        return true;
      }
      if(url.startsWith('/auth/printingArchiving/manuscript-request-form') && currentUserRoles.includes('PrintingArchiving')){
        return true;
      }

      // **********************
      if(url.startsWith('/auth/giftSpecialLibraries/home') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/libraries-exchange-view') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/libraries-exchange-archived') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/libraries-exchange-form') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/request-gift-view') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/request-gift-form') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      if(url.startsWith('/auth/giftSpecialLibraries/request-gift-archived') && currentUserRoles.includes('GiftSpecialLibraries')){
        return true;
      }
      // **************************

      if(url.startsWith('/auth/femalBeneficicareis/home') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      if(url.startsWith('/auth/femalBeneficicareis/ask-librarian-view') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      if(url.startsWith('/auth/femalBeneficicareis/ask-librarian-archived') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      if(url.startsWith('/auth/femalBeneficicareis/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('FemalBeneficicareis')){
        return true;
      }
      // ****************************

      if(url.startsWith('/auth/technicalDepartment/home') && currentUserRoles.includes('TechnicalDepartment')){
        return true;
      }
      if(url.startsWith('/auth/technicalDepartment/subscribe-list') && currentUserRoles.includes('TechnicalDepartment')){
        return true;
      }
      if(url.startsWith('/auth/technicalDepartment/subscribe-form') && currentUserRoles.includes('TechnicalDepartment')){
        return true;
      }

      // **********************************

      if(url.startsWith('/auth/maleLibRelations/home') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/maleLibRelations/visit-library-view') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-archived') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/maleLibRelations/ask-librarian-archived') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/maleLibRelations/ask-librarian-view') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      if(url.startsWith('/auth/maleLibRelations/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-form/edit-visitRequest') && currentUserRoles.includes('MaleLibRelations')){
        return true;
      }
      //-------------
      if(url.startsWith('/auth/femaleLibRelations/home') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/femaleLibRelations/visit-library-view') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-archived') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/femaleLibRelations/ask-librarian-view') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/femaleLibRelations/ask-librarian-archived') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      if(url.startsWith('/auth/femaleLibRelations/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-form/edit-visitRequest') && currentUserRoles.includes('FemaleLibRelations')){
        return true;
      }
      // **********************************


      else if(url.startsWith('/auth/programsAndEvents/visit-library-form/edit-visitRequest') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-generate') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-schedule') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      // *****************************************

      else if(url.startsWith('/auth/libraryServices/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/ask-librarian-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/libraryServices/ask-librarian-archived') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }

      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-view') && currentUserRoles.includes('PublicAdminstration')){
        return true;
      }


      // *****************************

      if(url.startsWith('/auth/universityThesises/home') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-form/edit-thesisDepositionRequest') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-view') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-archived') && currentUserRoles.includes('Supplies')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/profile') && currentUserRoles.includes('Supplies')){
        return true;
      }

      //--------------------------------

      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-view') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/ask-librarian-archived') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-form/edit-visitRequest') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-generate') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-schedule') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-view') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/visit-library-archived') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      else if(url.startsWith('/auth/programsAndEvents/profile') && currentUserRoles.includes('ProgramsAndEvents')){
        return true;
      }
      if(url.startsWith('/auth/universityThesises/home') && currentUserRoles.includes('UniversityThesises')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-form/edit-thesisDepositionRequest') && currentUserRoles.includes('UniversityThesises')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-view') && currentUserRoles.includes('UniversityThesises')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/scientific-thesis-archived') && currentUserRoles.includes('UniversityThesises')){
        return true;
      }
      else if(url.startsWith('/auth/universityThesises/profile') && currentUserRoles.includes('UniversityThesises')){
        return true;
      }
      if(url.startsWith('/auth/technicalSupport/home') && currentUserRoles.includes('TechnicalSupport')){
        return true;
      }
      else if(url.startsWith('/auth/technicalSupport/ask-librarian-form/edit-inquiry') && currentUserRoles.includes('TechnicalSupport')){
        return true;
      }
      else if(url.startsWith('/auth/technicalSupport/ask-librarian-view') && currentUserRoles.includes('TechnicalSupport')){
        return true;
      }
      else if(url.startsWith('/auth/technicalSupport/ask-librarian-archived') && currentUserRoles.includes('TechnicalSupport')){
        return true;
      }
      else if(url.startsWith('/auth/technicalSupport/profile') && currentUserRoles.includes('TechnicalSupport')){
        return true;
      }
      ///in case we needed back the 'Employee' role
      else if(url.startsWith('/auth/employee/home')){
        return true;
      }
      else if(url.startsWith('/auth/employee/buy-book-form/edit-suggestion')){
        return true;
      }
      else if(url.startsWith('/auth/employee/buy-book-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/buy-book-archived')){
        return true;
      }
      else if(url.startsWith('/auth/employee/ask-librarian-form/edit-inquiry')){
        return true;
      }
      else if(url.startsWith('/auth/employee/ask-librarian-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/visit-library-form/edit-visitRequest')){
        return true;
      }
      else if(url.startsWith('/auth/employee/visit-library-generate')){
        return true;
      }
      else if(url.startsWith('/auth/employee/visit-library-schedule')){
        return true;
      }
      else if(url.startsWith('/auth/employee/visit-library-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/research-retreat-form/edit-researchRequest')){
        return true;
      }
      else if(url.startsWith('/auth/employee/research-retreat-schedule')){
        return true;
      }
      else if(url.startsWith('/auth/employee/research-retreat-generate')){
        return true;
      }
      else if(url.startsWith('/auth/employee/research-retreat-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/scientific-thesis-form/edit-thesisDepositionRequest')){
        return true;
      }
      else if(url.startsWith('/auth/employee/scientific-thesis-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/book-gift-form/edit-giftRequest')){
        return true;
      }
      else if(url.startsWith('/auth/employee/book-gift-view')){
        return true;
      }
      else if(url.startsWith('/auth/employee/profile')){
        return true;
      }

      this.route.navigate(['/auth/employee/home']);
      return false;
    }
  }
}
