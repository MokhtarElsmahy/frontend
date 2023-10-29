import { Injectable } from '@angular/core';
import { HttpRequestService } from 'src/app/shared/services/http-request.service';


@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private httRequest : HttpRequestService) { }

  sendPasswordResetLink(email: string) {
    return this.httRequest
      .postRequest('sendResetPasswordLink/', { email });

  }
  resetPassword(body:any) {
    return this.httRequest
      .postRequest('resetPassword/', body);

  }

}
