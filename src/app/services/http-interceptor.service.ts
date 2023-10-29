import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalService } from '../shared/services/global.service';
import { UtilService } from './util.service';



export class Response <T> {
  error?: string;
  code?: string;
  data?: T;
  errors?: string[];
  message?: string;
}


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(private httpClient: HttpClient,
    private global: GlobalService,
    private util: UtilService,
    private router: Router) { }

    
  request(method: string, url: string, options?: AppRequestOptions): Observable<any> |  Observable<Response<any>> {
    const fullUrl = this.buildUrl(url);

    const observableResponse: Observable<any> = new Observable<any>(
      observer => {
        this.httpClient.request(method, fullUrl, this.getRequestOptionArgs(options))
          .subscribe(
            (response: any) => {
              if(response.body && response.body.status && !response.body.status.success ) {
                observer.error(response.body);

              } else {
                observer.next(response.body);
              }
            },
            (error: any) => {
              const {status} = error;

              // handle un authorization
              if (!this.isSkipAuthCheck(url) && status === ResponseStatus.Unauthorized) {
                console.error('Interceptor Unauthorized', error);
                alert('unauthorized');
                // log out user
                this.logout();
              } else if (status === ResponseStatus.REFRESH_TOKEN) {
                this.logout();
              } else if (status === ResponseStatus.OldVersion) {
                this.handelOldAPIVersion();
              } else {
                console.error('Interceptor Error', error);
              }
              // catch if there is issue parsing error to json
              try {
                if(error.status !== 0 ){
                  observer.error(error.body || error.error);
                }else {
                  observer.error(error.statusText);
                }
              } catch (e) {
                observer.error(error.statusText);
              }
            },
            () => {
              observer.complete();
            }
          );
      });

    return observableResponse;

  }

  logout() {
    localStorage.clear();

    this.global.resetUser();
      this.router.navigate(['/login']);
  }



  get(url: string, options?: AppRequestOptions): Observable<any> {
    options = options || {};
    return this.request('GET', url, options);
  }

  post(url: string, body: any, options?: AppRequestOptions): Observable<any> {
    options = options || {};
    options.body = body ;
    return this.request('POST', url, options);
  }

  put(url: string, body: any, options?: AppRequestOptions): Observable<any> {
    options = options || {};

    options.body = body ;
    return this.request('PUT', url, options);
  }

  delete(url: string, options?: AppRequestOptions): Observable<any> {
    options = options || {};
    return this.request('DELETE', url, options);
  }


  /**
   * This gives you the flexibility to change the url at anytime and make a code change within seconds.
   */
  private buildUrl(url: string): string {
    // get host rul based on env
    const hostUrl = `${environment.api_url}`;
    return hostUrl + url;
  }

  private getRequestOptionArgs(options?: AppRequestOptions): AppRequestOptions {


    if (options == null) {
      options = new AppRequestOptions();
    }
    if (options.headers == null) {
      options.headers = {};
    }

    options.observe =  'response';
    const activeUser = this.global.user.getValue();

    options.headers['Content-Type'] =  options.headers['Content-Type'] || 'application/json';
    if (activeUser) {
      options.headers['Authorization'] = `${activeUser['token']}`;
    }
    return options;
  }

  private isSkipAuthCheck(url: any): boolean {
    // skip login
    const listOfUrlToSkipAuthCheck = ['login'];
    const skipAuthCheck: boolean = listOfUrlToSkipAuthCheck.indexOf(url) > -1 ;
    return skipAuthCheck;
  }

  private handelOldAPIVersion() {
    this.util.handelOldAPIVersion();
  }
}




class AppRequestOptions {
  body?: any;
  headers?: any | {
    [header: string]: string | string[];
  };
  observe?: 'body' | any;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  responseType?: 'json' | any;
  reportProgress?: boolean;
  withCredentials?: boolean;
}


/**
 * Status code returned by server. Type script Enum representing the corresponding `status`, as defined in
 * [ietf rfc 2616 * section 6.1.1](https://tools.ietf.org/html/rfc2616#section-6.1.1)
 */
export  const  ResponseStatus =  {
  Continue : 100,
  SwitchingProtocols : 101 ,
  OK : 200 ,
  Created : 201 ,
  Accepted : 202 ,
  NonAuthoritativeInformation : 203 ,
  NoContent : 204 ,
  ResetContent : 205 ,
  PartialContent : 206 ,
  MultipleChoices : 300 ,
  Permanently : 301 ,
  Found : 302 ,
  SeeOther : 303 ,
  REFRESH_TOKEN: 452,
  NotModified : 304 ,
  UseProxy : 305 ,
  TemporaryRedirect : 307 ,
  BadRequest : 400 ,
  Unauthorized : 401 ,
  OldVersion : 451 ,
  PaymentRequired : 402 ,
  Forbidden : 403 ,
  NotFound : 404 ,
  MethodNotAllowed : 405 ,
  NotAcceptable : 406 ,
  ProxyAuthenticationRequired : 407 ,
  RequestTimeout : 408 ,
  Conflict : 409 ,
  Gone : 410 ,
  LengthRequired : 411 ,
  PreconditionFailed : 412 ,
  RequestEntityTooLarge : 413 ,
  RequestURITooLarge : 414 ,
  UnsupportedMediaType : 415 ,
  RequestedRangeNotSatisfiable : 416 ,
  ExpectationFailed : 417 ,
  InternalServerError : 500 ,
  NotImplemented : 501 ,
  BadGateway : 502 ,
  ServiceUnavailable : 503 ,
  GatewayTimeout : 504 ,
  HTTPVersionNotSupported : 505
};
