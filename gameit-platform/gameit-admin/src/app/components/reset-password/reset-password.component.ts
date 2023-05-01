import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CookiesStorageService } from '../../_services/cookies-storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: any = {
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  isTokenSent = false;
  isSendFailed = false;
  errorMessage = '';
  token: any;
  isTokenExist = false;
  isTokenValid = false;
  isNewPasswordSet = false;
  isPasswordResetSuccess!: boolean;
  resetPass = true;
  changePass = false;

  constructor(
    private authService: AuthService,
    private cookiesStorage: CookiesStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.cookiesStorage.getCookie('auth-token')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let token = params['token'];
      if (token !== undefined) {
        this.isTokenExist = true;
        this.authService.resetPasswordValidate(token).subscribe({
          next: (data: any) => {
            this.isTokenValid = true;
            this.token = token;
          },
          error: (err: any) => {
            this.errorMessage = 'The link is invalid or broken';
          },
        });
      }
    });
  }

  onEmailSubmit(): void {
    const { email } = this.form;

    this.authService.forgotPassword(email).subscribe({
      next: (data: any) => {
        if(data.success){
          this.isTokenSent = true;
          this.isSendFailed = false;
        }
      },
      error: (err: any) => {
        console.log(err.error);
        this.errorMessage = err.error.message;
        this.isTokenSent = false;
        this.isSendFailed = true;
      },
    });
  }

  onNewPasswordSubmit(): void {
    const { password, confirmPassword } = this.form;

    if (password === confirmPassword) {
      this.authService.resetPassword(password, this.token).subscribe({
        next: (data: any) => {
          this.isNewPasswordSet = true;
          this.isPasswordResetSuccess = true;
        },
        error: (err: any) => {
          console.log(err.error);
          this.errorMessage = err.error.message;
          this.isNewPasswordSet = true;
          this.isPasswordResetSuccess = false;
        },
      });
    }
  }

}