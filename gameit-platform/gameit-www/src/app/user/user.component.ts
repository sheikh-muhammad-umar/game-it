import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  form: any = {
    firstName: null,
    lastName: null,
    paymentInfo: null,
    phoneNo: null,
    username: null
  };

  isSuccessful = false;
  isDeleted = false;
  isReadOnly = true;
  isSignUpFailed = false;

  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    this.authService.saveUser(this.form).subscribe({
      next: data => {
        console.log("save success");
        this.isReadOnly = true;
      },
      error: err => {
        console.log("save error");
        this.errorMessage = err.error.message;
      }
    });
  }
}
