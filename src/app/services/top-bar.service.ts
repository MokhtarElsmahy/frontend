import { Injectable } from '@angular/core';
import { HttpRequestService } from '../shared/services/http-request.service';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {

  constructor(private httpRes: HttpRequestService) { }

  //authorize
  getNotReadedNotification(userId) {
    return  this.httpRes.GetAuthRequest('Notification/GetTopTen/' + userId).toPromise();
  }
  updateNotificationReaded(userId) {
    return  this.httpRes.postAuthRequest('Notification/UpdateToReaded/' , userId).toPromise();
  }
}