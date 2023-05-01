import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = '/api/auth/';
const AUTH_APIx = 'http://localhost:3000/api/auth/';

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

  forgotPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'forgot_password', {
      email
    }, httpOptions);
  }

  resetPassword(password: string, token: string): Observable<any> {
    return this.http.post(AUTH_API + 'reset_password', {
      password, 
      token
    }, httpOptions);
  }

  resetPasswordValidate(token: string): Observable<any> {
    let params = new HttpParams().set('token', token);
    return this.http.get(AUTH_API + 'reset_password', { params: params });
  }

  register(firstName:string, lastName:string, username: string, emailId: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      firstName,
      lastName,
      username,
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

  addStudent(firstName:string, lastName:string, username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'addstudent', {
      firstName,
      lastName,
      username,
      password
    }, httpOptions);
  }

  getStudent(id:number): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(AUTH_API + 'getstudent', { params: params });
  }

  saveStudent(id:number, data: any): Observable<any> {
    console.log(id,data);
    let params = new HttpParams().set('studentId', id);
    return this.http.put(AUTH_API + 'savestudent', data, { params: params });
  }

  saveUser( data: any): Observable<any> {
    console.log(data);
    return this.http.put(AUTH_API + 'saveuser', data);
  }

  deleteStudent(id:number): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(AUTH_API + 'deletestudent', { params: params });
  }


  contact(name:string, phone:string, email: string, message: string): Observable<any> {
    
    return this.http.post(AUTH_API + 'contact', {
      name,
      phone,
      email,
      message
    }, httpOptions);
    
  }

  students(): Observable<any> {
    return this.http.get(AUTH_API + 'students');
  }

  verify(token: string): Observable<any> {
    return this.http.get(AUTH_API + 'confirm-account', 
      {
        params:{token}
      });
  }
}
