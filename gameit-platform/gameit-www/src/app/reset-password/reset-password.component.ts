import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: any = {
  };

  isTokenSent = false;
  isSendFailed = false;
  errorMessage = '';
  token: any;
  isTokenExist = false;
  isTokenValid = false ;
  isNewPasswordSet = false;
  isPasswordResetSuccess:boolean;

  constructor(private authService: AuthService,  private tokenStorage: TokenStorageService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        let token=params['token'];
        if (token!==undefined)
        {
          this.isTokenExist = true;
          this.authService.resetPasswordValidate(token).subscribe({
            next: data => {
              this.isTokenValid = true;
              this.token = token;
            },
            error: err => {
              this.errorMessage = 'The link is invalid or broken'
            }
          });
        }
      }
    );
  }

  onEmailSubmit(): void {
    const { email } = this.form;
    
    this.authService.forgotPassword(email).subscribe({
      next: data => {
        console.log(data);
        this.isTokenSent=true;
        this.isSendFailed = false;
      },
      error: err => {
        console.log(err.error);
        this.errorMessage = err.error.message;
        this.isTokenSent=false;
        this.isSendFailed = true;
      }
    });
  }

  onNewPasswordSubmit(): void {
    const { password, confirmPassword } = this.form;
    
    if (password === confirmPassword) {
      this.authService.resetPassword(password,this.token).subscribe({
        next: data => {
          console.log(data);
          this.isNewPasswordSet=true;
          this.isPasswordResetSuccess = true;
        },
        error: err => {
          console.log(err.error);
          this.errorMessage = err.error.message;
          this.isNewPasswordSet=true;
          this.isPasswordResetSuccess = false;
        }
      });
    }
  }

}