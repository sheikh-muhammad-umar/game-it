import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CookiesStorageService } from '../../_services/cookies-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() loggedIn = new EventEmitter<any>();

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  isFirstLogin = false;
  errorMessage = '';
  role!: null;

  constructor(private authService: AuthService, private cookiesStorage: CookiesStorageService, private router: Router,private route: ActivatedRoute) {
    if (this.cookiesStorage.getCookie('authToken')) {
      this.isLoggedIn = true;
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    if (this.cookiesStorage.getCookie('authToken')) {
      this.isLoggedIn = true;
      // console.log("this.isLoggedIn", this.isLoggedIn)
      this.router.navigate(['/']);

      // this.role = this.tokenStorage.getUser().role;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    // console.log("username, password: ", username, password);
    
    this.authService.login(username, password).subscribe({
      next: (data: any) => {
        // console.log("GraphQL: ", data.data);

        // if(data.user.flags.passwordChangeRequired){
        //   this.isFirstLogin = data.user.flags.passwordChangeRequired;
        // }
        this.cookiesStorage.createCookie('authToken', data.data.login.token.token, 2);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.loggedIn.emit({loggedIn: true, user: data.data.login.me});

        // this.role = this.tokenStorage.getUser().role;
        // this.reloadPage();
      },
      error: err => {
        console.log(err);
        // this.errorMessage = err.error.message;
        // this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {

    window.location.href='/gp';
   
    /*
    if (this.role==='guardian') {
        window.location.href='/gp';
    } else if (this.role==='student'){
      window.location.href='/sp';
    }
    else {
      window.location.href='/';
    }
    */

  }
}
