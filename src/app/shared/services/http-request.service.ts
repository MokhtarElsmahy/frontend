import { Injectable } from '@angular/core';
import { config, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/shared/services/global.service';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  userToken: string;
  constructor(private http: HttpClient, private global: GlobalService, public translate: TranslateService) {
    this.userToken = global.getCurrentUserToken();
  }


  private createHeader() {
    // set headers here e.g.
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Accept-Language": this.translate.currentLang
    });

    return headers;
  }

  private createFileHeader() {
    // set headers here e.g.
    const headers = new HttpHeaders({
      "Accept-Language": this.translate.currentLang
    });
    return headers;
  }

  private createAuthHeader(token: String) {
    // set headers here e.g.
    var headerLang;
    if (this.translate.currentLang == 'ar') { headerLang = 'ar-EG'; }
    else { headerLang = 'en-US'; }
 
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Language": headerLang//this.translate.currentLang
    });

    return headers;
  }

  private createAuthHeaderRecaptcha(token: String,reCaptcha:string) {
    // set headers here e.g.
    var headerLang;
    if (this.translate.currentLang == 'ar') { headerLang = 'ar-EG'; }
    else { headerLang = 'en-US'; }
 
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "ReCaptcha": reCaptcha,
      "Content-Type": "application/json",
      "Accept-Language": headerLang//this.translate.currentLang
    });

    return headers;
  }

  private createAuthHeaderFile(token: String) {
    // set headers here e.g.
    const headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Accept-Language": this.translate.currentLang,
      "Accept": "blob"
    });

    return headers;
  }


  GetRequestFile(path: string) {
    return this.GetAuthRequestFile(path)
  }

  GetRequest(path: string) {
    const url = environment.api_url + '/' + path;
    const headers = this.createHeader();
    return this.http.get(url, { headers: headers }).pipe(
      catchError(error => {
        // console.log(error);
        return new Observable(undefined);
      })
    );
  }

  deleteRequest(path: string) {
    const url = environment.api_url + '/' + path;
    const headers = this.createHeader();
    return this.http.delete(url);
  }

  GetAuthRequest(path: string) {

    const url = environment.api_url + '/' + path;
    const headers = this.createAuthHeader(this.global.getCurrentUserToken());
    return this.http.get(url, { headers: headers }).pipe(
      catchError(error => {
        // console.log(error);
        return new Observable(undefined);
      })
    );



  }
  GetAuthRequestFile(path: string) {
    const url = environment.api_url + '/' + path;
    const headers = this.createAuthHeaderFile(this.global.getCurrentUserToken());
    return this.http.get(url, { headers: headers, responseType: "blob" });
  }

  postRequest(path: string, body: any) {
    const url = environment.api_url + '/' + path;
    const headers = this.createHeader();
    return this.http.post(url, JSON.stringify(body), { headers: headers }).pipe(
      catchError(error => {

        if (error.name = 'HttpErrorResponse') {
          // console.log(error.name);
          return of([]);
        }
        else
          return throwError(error);
      })
    );
  }
  postFile(path: string, body: any) {
    const url = environment.api_url + '/' + path;
    const headers = this.createFileHeader();
    return this.http.post(url, body);
  }
  postAuthFile(path: string, body: any) {
    const url = environment.api_url + '/' + path;
    const headers = this.createAuthHeaderFile(this.global.getCurrentUserToken());
    return this.http.post(url, body, { headers: headers });
  }
  postAuthRequest(path: string, body: any) {

    const url = environment.api_url + '/' + path;
    const headers = this.createAuthHeader(this.global.getCurrentUserToken());
    return this.http.post(url, JSON.stringify(body), { headers: headers });
  }

  postAuthRequestRecaptcha(path: string, body: any,reCaptcha:string) {

    const url = environment.api_url + '/' + path;
    const headers = this.createAuthHeaderRecaptcha(this.global.getCurrentUserToken(),reCaptcha);

    return this.http.post(url, JSON.stringify(body), { headers: headers });
  }

  jsonp(url: string) {
    return this.http.jsonp(url, 'callback');
  }
}
