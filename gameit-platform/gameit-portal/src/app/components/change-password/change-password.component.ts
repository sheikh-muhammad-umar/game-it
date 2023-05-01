import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerCallsService } from 'src/app/_services/server-calls.service';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  @Output() passwordChanged = new EventEmitter<any>();

  form: any = {
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

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private serverService: ServerCallsService
  ) {}

  ngOnInit(): void {}

  onNewPasswordSubmit(): void {
    const { password, newPassword, confirmPassword } = this.form;

    if (newPassword === confirmPassword) {
      this.serverService.changePassword(password, confirmPassword).subscribe({
        next: (data: any) => {
            this.isNewPasswordSet = true;
            this.isPasswordResetSuccess = true;
        },
        error: (err: any) => {
          console.log(err);
          this.errorMessage = err;
          this.isNewPasswordSet = true;
          this.isPasswordResetSuccess = false;
        },
      });
    }
  }

  login(){
    this.passwordChanged.emit({isFirstLogin: false});
    this.router.navigate(['/']);
  }
}
