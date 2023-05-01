import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class CookiesStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  removeCookie(name: string): void {
    let expires = '';
      expires = '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    document.cookie = name + '=' + ' ' + expires + '; path=/';
  }

  createCookie(name: string, value: string, days?: number) {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date;
    }

    document.cookie = name + '=' + value + expires + '; path=/';
  }

  getCookie(ccookieName: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (document?.cookie?.length > 0) {
        let cookieStart = document.cookie.indexOf(ccookieName + '=');
        if (cookieStart !== -1) {
          cookieStart = cookieStart + ccookieName.length + 1;
          let cookieEnd = document.cookie.indexOf(';', cookieStart);
          if (cookieEnd === -1) {
            cookieEnd = document.cookie.length;
          }
          return unescape(document.cookie.substring(cookieStart, cookieEnd));
        }
      }
      return '';
    }
    return '';
  }
}
