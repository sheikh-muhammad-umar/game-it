import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  @Input() username!: string;

  public form: any = {
    username: null,
    code: null,
  };

  public codeSent = true;
  public notVerified = false;
  public verified = false;
  public codeSendingFailed = false;
  public errorMessage = '';

  public reSendCodeTimer = 20;
  public resendCode = false;
  public codeTimer!: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    ) {
      this.form.username = this.username;
    }

  ngOnInit() {
    this.form.username = this.username;
    this.reSendCodeInterval();
  }

  sendEmailVerificationCode(){
    // console.log("Username: ", this.form.username);
    this.authService.sendEmailVerificationCode(this.form.username).subscribe({
      next: (data) => {
        this.codeSent = true;
      },
      error: (error) => {
        // console.log("Error in sending verification code: ", error.message);
        this.codeSendingFailed = true;
        this.errorMessage = error.message;
      }
    });
    this.resetCodeTimer();
  }
  
  verifyEmail(){
    // console.log("Code: ", this.form);
    this.authService.verifyEmail(this.form.username, this.form.code).subscribe({
      next: (data) => {
        // console.log(data);
        this.verified = true;
      },
      error: (error) => {
        // console.log("Error in email verification: ", error.message);
        this.notVerified = true;
        this.errorMessage = error.message;
      }
    });
  }

  resetCodeTimer(){
    this.reSendCodeTimer = 20;
    this.resendCode = false;
    this.reSendCodeInterval();
  }

  reSendCodeInterval(){
    this.codeTimer = setInterval(()=>{
      if(this.reSendCodeTimer == 1) {
        clearInterval(this.codeTimer);
        this.resendCode = true;
      }
      this.reSendCodeTimer--;
    }, 1000);
  }
}
