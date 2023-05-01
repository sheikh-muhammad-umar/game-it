import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(firstName:string, lastName:string, userName: string, emailId: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      firstName,
      lastName,
      userName,
      emailId,
      password
    }, httpOptions);
  }

  preregister(firstName:string, lastName:string, emailId: string, phone: string, role:string): Observable<any> {
    
    return this.http.post(AUTH_API + 'preregister', {
      firstName,
      lastName,
      emailId,
      phone, 
      role
    }, httpOptions);
    
  }

  contact(name:string, phone:string, email: string, message: string): Observable<any> {
    
    return this.http.post(AUTH_API + 'contact', {
      name,
      phone,
      email,
      message
    }, httpOptions);
    
  }

  verify(token: string): Observable<any> {
    return this.http.get(AUTH_API + 'confirm-account', 
      {
        params:{token}
      });
  }
}
