import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = '/api/auth/';
const STUDENT_API = '/api/student/';

const AUTH_API2 = 'http://localhost:8080/api/auth/';

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
    return this.http.post(STUDENT_API + 'addstudent', {
      firstName,
      lastName,
      username,
      password
    }, httpOptions);
  }

  getStudent(id:any): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(STUDENT_API + 'getstudent', { params: params });
  }

  assignGameToStudent(data: any): Observable<any> {
    console.log(data);
    let params = new HttpParams().set('studentId', data.studentId).append('gameId',data.gameId).append('instructions',data.instructions);
    return this.http.get(STUDENT_API + 'addGame',  { params: params });
  }

  getGameSessionAll(id:any): Observable<any> {
    let params = new HttpParams().set('StudentID', id);
    return this.http.get(STUDENT_API + 'gamesession', { params: params });
  }

  getGameSession(sid:any, gid:any): Observable<any> {
    let params = new HttpParams().set('StudentID', sid).append('GameID', gid);
    return this.http.get(STUDENT_API + 'gamesession', { params: params });
  }

  saveStudent(id:any, data: any): Observable<any> {
    console.log(id,data);
    let params = new HttpParams().set('studentId', id);
    return this.http.put(STUDENT_API + 'savestudent', data, { params: params });
  }

  saveUser( data: any): Observable<any> {
    console.log(data);
    return this.http.put(AUTH_API + 'saveuser', data);
  }

  deleteStudent(id:number): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(STUDENT_API + 'deletestudent', { params: params });
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
    console.log("auth service students");
    return this.http.get(STUDENT_API + 'students');
  }

  studentGames(id:number): Observable<any> {
    let params = new HttpParams().set('StudentID', id).append('language','en');
    return this.http.get(STUDENT_API + 'studentGames',{ params: params });
  }

  verify(token: string): Observable<any> {
    return this.http.get(AUTH_API + 'confirm-account', 
      {
        params:{token}
      });
  }
}
