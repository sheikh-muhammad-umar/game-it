import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookiesStorageService } from './cookies-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.cookiesStorageService.getCookie('auth-token')}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookiesStorageService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(environment.AUTH_API2 + '/api/auth/login', {
      username,
      password
    }, this.httpOptions);
  }

  register(firstName:string, lastName:string, username: string, emailId: string, password: string): Observable<any> {
    return this.http.post(environment.AUTH_API + 'signup', {
      firstName,
      lastName,
      username,
      emailId,
      password
    }, this.httpOptions);
  }

  preregister(firstName:string, lastName:string, emailId: string, phone: string, role:string): Observable<any> {
    
    return this.http.post(environment.AUTH_API + 'preregister', {
      firstName,
      lastName,
      emailId,
      phone, 
      role
    }, this.httpOptions);
    
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(environment.AUTH_API2 + '/api/auth/request-reset-password', {
      username: email
    }, this.httpOptions);
  }

  resetPassword(password: string, token: string): Observable<any> {
    return this.http.post(environment.AUTH_API2 + '/api/auth/reset-password', {
      password, 
      token
    }, this.httpOptions);
  }

  resetPasswordValidate(token: string): Observable<any> {
    return this.http.post(environment.AUTH_API2 + '/api/auth/validate-reset-password-token', { token });
  }

  addStudent(firstName:string, lastName:string, username: string, password: string): Observable<any> {
    return this.http.post(environment.STUDENT_API + 'addstudent', {
      firstName,
      lastName,
      username,
      password
    }, this.httpOptions);
  }

  getStudent(id:any): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(environment.STUDENT_API + 'getstudent', { params: params });
  }

  assignGameToStudent(data: any): Observable<any> {
    console.log(data);
    let params = new HttpParams().set('studentId', data.studentId).append('gameId',data.gameId).append('instructions',data.instructions);
    return this.http.get(environment.STUDENT_API + 'addGame',  { params: params });
  }

  getGameSessionAll(id:any): Observable<any> {
    let params = new HttpParams().set('StudentID', id);
    return this.http.get(environment.STUDENT_API + 'gamesession', { params: params });
  }

  getGameSession(sid:any, gid:any): Observable<any> {
    let params = new HttpParams().set('StudentID', sid).append('GameID', gid);
    return this.http.get(environment.STUDENT_API + 'gamesession', { params: params });
  }

  saveStudent(id:any, data: any): Observable<any> {
    console.log(id,data);
    let params = new HttpParams().set('studentId', id);
    return this.http.put(environment.STUDENT_API + 'savestudent', data, { params: params });
  }

  saveUser( data: any): Observable<any> {
    console.log(data);
    return this.http.put(environment.AUTH_API + 'saveuser', data);
  }

  deleteStudent(id:number): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(environment.STUDENT_API + 'deletestudent', { params: params });
  }


  contact(name:string, phone:string, email: string, message: string): Observable<any> {
    
    return this.http.post(environment.AUTH_API + 'contact', {
      name,
      phone,
      email,
      message
    }, this.httpOptions);
    
  }

  students(): Observable<any> {
    console.log("auth service students");
    return this.http.get(environment.STUDENT_API + 'students');
  }

  studentGames(id:number): Observable<any> {
    let params = new HttpParams().set('StudentID', id).append('language','en');
    return this.http.get(environment.STUDENT_API + 'studentGames',{ params: params });
  }

  verify(token: string): Observable<any> {
    return this.http.get(environment.AUTH_API + 'confirm-account', 
      {
        params:{token}
      });
  }
}
