import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.css']
})
export class AddstudentComponent implements OnInit {
  form: any = {
    firstname: null,
    lastname: null,
    username: null,
    password: null
  };
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,  private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { firstname, lastname, username, email, password } = this.form;

    this.authService.addStudent(firstname, lastname, username, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  closeNav():void {
    this.router.navigate(['/board/students']);
  }
}

