import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LoginUser } from '../models/DTO/LoginUser';
import { UserNotification } from '../models/DTO/uer-notification';
import { Message } from '../models/system/message';
import { ResponseStatusEnum } from '../models/system/response-status.enum';

const USER_LOCAL_STORAGE_KEY = 'LIB_USER';
const LANG_LOCAL_STORAGE_KEY = 'LIB_LANG';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  messages: Message[];
  private status: ResponseStatusEnum;
  public get Status(): ResponseStatusEnum {
    return this.status;
  }
  public set Status(value: ResponseStatusEnum) {
    this.status = value;
  }
  user: BehaviorSubject<LoginUser> = new BehaviorSubject<LoginUser>(this.getUserFromLocalStorage());
  private spinner: boolean = false;

  private notifications: UserNotification[];

  constructor(public translate: TranslateService) {
    this.messages = new Array();
    this.initLanguage();
    this.user.subscribe(
      user => {
        this.setUserData(user);
      }
    );
  }


  setUserAndUpdateTheApp(user: LoginUser) {
    this.setUserData(user);
    this.user.next(user);
  }

  private setUserData(user: LoginUser) {

    this.setUserInLocalStorage(user);
  }

  isUserExist(): boolean {
    const user: LoginUser = this.user.getValue();
    const exist = !!(user && user.token);

    return exist;
  }


  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  resetUser() {
    localStorage.clear();

    this.user.next(null);
  }

  setUserInLocalStorage(user: LoginUser) {
    // console.log('setUserInLocalStorage');
    // console.log(user);
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
  }

  getUserFromLocalStorage(): LoginUser {
    let user = null;
    try {
      const text = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
      if (text && text !== '') {
        const data = JSON.parse(text);
        user = data;
      }
    } catch (e) {
      console.error(e);
    }
    return user;
  }


  public getLang(): any {
    const dataString = localStorage.getItem(LANG_LOCAL_STORAGE_KEY);
    if (!dataString) {
      return 'ar';
    }
    return dataString;
  }


  public isRtl(): boolean {
    return this.getLang() === 'ar';
  }

  public getCurrentUserToken(): string {
    const user: LoginUser = this.user.getValue();
    const exist = !!(user && user.token);
    if (exist === true)
      return this.getUserFromLocalStorage().token;
    else return '';
  }
  public getCurrentUserId(): string {
    const user: LoginUser = this.user.getValue();
    const exist = !!(user && user.userId);
    if (exist === true)
      return this.getUserFromLocalStorage().userId;
    else return '';
  }
  public setLang(lang: any): any {
    const dataString = localStorage.setItem(LANG_LOCAL_STORAGE_KEY, lang);
    return dataString;
  }


  useLanguage(language: string) {
    this.setLang(language);
    this.initLanguage();
  }

  initLanguage() {
    const lang = this.getLang();
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);

    if (lang === 'ar') {
      console.warn('set rtl');
      document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
      document.getElementsByTagName("html")[0].setAttribute("lang", "ar");

    } else {
      console.warn('set ltr');
      document.getElementsByTagName("html")[0].setAttribute("dir", "ltr");
      document.getElementsByTagName("html")[0].setAttribute("lang", "en");

    }
  }

  set Messages(value : Message[]) {
     this.messages = value;

  }
  get Messages(): Message[] {
    return this.messages;

  }

  addMessages(message: Message[]) {
    message.forEach(element => {
      this.messages.push(element);
    });

  }
  clearMessages() {
    this.messages = [];
  }
  public get Spinner(): boolean {
    return this.spinner;
  }
  public set Spinner(value: boolean) {
    this.spinner = value;
  }

  get Notifications() {
    if (this.notifications === null || this.notifications === undefined) {
       this.notifications = new Array();
    }
    return this.notifications;
 }
 set Notifications(value) {
    this.notifications = value;
 }
}
