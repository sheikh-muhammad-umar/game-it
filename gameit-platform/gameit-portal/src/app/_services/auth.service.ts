import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookiesStorageService } from './cookies-storage.service';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.cookiesStorageService.getCookie(
        'authToken'
      )}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookiesStorageService,
    private apollo: Apollo
  ) {}

  login(username: string, password: string) {
    const LOGIN_POST = gql`
    mutation LoginUser (
      $input: LoginInput!
    ) {
      login(input: $input, cookie: true) {
        me {
          id
          firstName
          lastName
          language
          countryCode
          role {
            type
          }
        }
        token {
          token
        }
      }
    }
    `;

    return this.apollo.mutate({
      mutation: LOGIN_POST,
      variables: {
        input: {
          username,
          password
        }
      },
    });
  }

  register(
    firstName: string,
    lastName: string,
    role: string,
    username: string,
    email: string,
    password: string,
    country: string,
    school: any,
  ): Observable<any> {
    const SIGNUP_POST = gql`
    mutation Signup (
      $inputs: SignupInputs!
    ) {
      signUp(inputs: $inputs)
    }
    `;

    return this.apollo.mutate({
      mutation: SIGNUP_POST,
      variables: {
        inputs: {
          country,
          email,
          firstName,
          lastName,
          password,
          role,
          school,
          username
        }
      },
    });
  }

  forgotPassword(username: string){
    const RESET_REQUEST_POST = gql`
    mutation resetPasswordRequest(
      $inputs: ResetPasswordRequestInputs!
    ) {
      resetPasswordRequest(inputs: $inputs)
    }
    `;

    return this.apollo.mutate({
      mutation: RESET_REQUEST_POST,
      variables: {
        inputs: {
          username
        }
      },
    });
  }  

  resetPassword(username: string, password: string, code: string): Observable<any> {
    const RESET_PASSWORD_POST = gql`
    mutation verifyCodeAndResetPassword(
      $inputs: VerifyAndResetPasswordCodeInputs!
    ) {
      verifyCodeAndResetPassword(inputs: $inputs)
    }
    `;

    return this.apollo.mutate({
      mutation: RESET_PASSWORD_POST,
      variables: {
        inputs: {
          code,
          password,
          username
        }
      },
    });
  }

  addStudent(
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ): Observable<any> {
    return this.http.post(
      environment.STUDENT_API + 'addstudent',
      {
        firstName,
        lastName,
        username,
        password,
      },
      this.httpOptions
    );
  }

  sendEmailVerificationCode(username: string){
    const EMAIL_CODE_POST = gql`
    mutation SendVerificationCode ( $inputs: SendActivationCodeInputs! ) {
      sendVerificationCode (inputs: $inputs)
    }
    `;

    return this.apollo.mutate({
      mutation: EMAIL_CODE_POST,
      variables: {
        inputs: {
          username
        }
      },
    });
  }

  verifyEmail(username: string, code: string){
    const Verify_EMAIL_POST = gql`
    mutation VerifyAndActivateUserAccount ( $inputs: VerifyAndActivateUserAccountInputs! ) {
	verifyAndActivateUserAccount (inputs: $inputs)
}
    `;

    return this.apollo.mutate({
      mutation: Verify_EMAIL_POST,
      variables: {
        inputs: {
          username,
          code
        }
      },
    });
  }

  // Regular HTTP calls - Deleted after GraphQL implementation
  resetPasswordValidate(token: string): Observable<any> {
    return this.http.post(
      environment.AUTH_API2 + '/api/auth/validate-reset-password-token',
      { token }
    );
  }

  getStudent(id: any): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(environment.STUDENT_API + 'getstudent', {
      params: params,
    });
  }

  assignGameToStudent(data: any): Observable<any> {
    console.log(data);
    let params = new HttpParams()
      .set('studentId', data.studentId)
      .append('gameId', data.gameId)
      .append('instructions', data.instructions);
    return this.http.get(environment.STUDENT_API + 'addGame', {
      params: params,
    });
  }

  getGameSessionAll(id: any): Observable<any> {
    let params = new HttpParams().set('StudentID', id);
    return this.http.get(environment.STUDENT_API + 'gamesession', {
      params: params,
    });
  }

  getGameSession(sid: any, gid: any): Observable<any> {
    let params = new HttpParams().set('StudentID', sid).append('GameID', gid);
    return this.http.get(environment.STUDENT_API + 'gamesession', {
      params: params,
    });
  }

  saveStudent(id: any, data: any): Observable<any> {
    console.log(id, data);
    let params = new HttpParams().set('studentId', id);
    return this.http.put(environment.STUDENT_API + 'savestudent', data, {
      params: params,
    });
  }

  saveUser(data: any): Observable<any> {
    console.log(data);
    return this.http.put(environment.AUTH_API + 'saveuser', data);
  }

  deleteStudent(id: number): Observable<any> {
    let params = new HttpParams().set('studentId', id);
    return this.http.get(environment.STUDENT_API + 'deletestudent', {
      params: params,
    });
  }

  contact(
    name: string,
    phone: string,
    email: string,
    message: string
  ): Observable<any> {
    return this.http.post(
      environment.AUTH_API + 'contact',
      {
        name,
        phone,
        email,
        message,
      },
      this.httpOptions
    );
  }

  students(): Observable<any> {
    console.log('auth service students');
    return this.http.get(environment.STUDENT_API + 'students');
  }

  studentGames(id: number): Observable<any> {
    let params = new HttpParams().set('StudentID', id).append('language', 'en');
    return this.http.get(environment.STUDENT_API + 'studentGames', {
      params: params,
    });
  }

  verify(token: string): Observable<any> {
    return this.http.get(environment.AUTH_API + 'confirm-account', {
      params: { token },
    });
  }
}
