import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookiesStorageService } from './cookies-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ServerCallsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.cookiesStorageService.getCookie('auth-token')}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookiesStorageService
  ) {}

  getStats(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/api/dashboard/stats`,
      { dateRange },
      this.httpOptions
    );
  }

  totalUsersByGoogle(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/google/totalusers`,
      { dateRange },
      this.httpOptions
    );
  }

  newUsersByGoogle(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/google/newusers`,
      { dateRange },
      this.httpOptions
    );
  }

  getUser() {
    return this.http.post(
      `${environment.AUTH_API2}/api/user/info`,{},
      this.httpOptions
    );
  }
 
  changePassword(password: string, newPassword: string) {
    return this.http.post(
      `${environment.AUTH_API2}/api/settings/change-password`,{password, newPassword},
      this.httpOptions
    );
  }
}
