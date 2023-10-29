import { Injectable, Injector, Type } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, of, observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
import { Message } from '../models/system/message';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  router: any;
  constructor(private injector: Injector) { }
  get global() {
    return this.injector.get<GlobalService>(GlobalService as Type<GlobalService>);
  }
  get translate() {
    return this.injector.get<TranslateService>(TranslateService as Type<TranslateService>);
  }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {

        let handled: boolean = false;
      
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("1 - Error Event");
          } else {
            console.log(`2- error status : ${error.status} ${error.statusText}`);
         
            switch (error.status) {
              case 401:      //Unauthorized
                console.log(`4- redirect to login`);
                this.router.navigateByUrl("/visitor/login");
                console.log(`3 - redirect to login`);
                handled = true;
                break;
              case 403:     //forbidden
                console.log(`4- redirect to login`);
                this.router.navigateByUrl("/visitor/login");

                handled = true;
                break;
              case 0:     //unknown error
                console.log(`5- set system message`);
                this.global.addMessages([{ body: this.translate.instant('system.message.service-not-available') }]);
                handled = true;
                break;
            }
          }
        }


        if (handled) {
          console.log('6 - return back ');
          return of(error);
        } else {
          console.log('7 - throw error back to to the subscriber');
          return throwError(error);
        }

      }));






  }
}
