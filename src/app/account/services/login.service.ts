
import { Injectable } from '@angular/core';
import { HttpRequestService } from 'src/app/shared/services/http-request.service'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httRequest : HttpRequestService) { }

  login(userName: string, password: string) {
    return this.httRequest
      .postAuthRequest('auth/login', { userName, password });

  }


}
