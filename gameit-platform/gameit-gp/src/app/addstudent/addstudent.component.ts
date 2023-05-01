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
    firstName: null,
    lastName: null,
    username: null,
    password: null,
    userid:null,
    birthdate: null,
    city: null,
    country: null,
    diagnoses: null,
    school: null
  };
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isUserCreated = false;
  isUserUpdated = false;

  constructor(private authService: AuthService,  private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.isUserCreated) {
      const { firstName, lastName, username, email, password } = this.form;

      this.authService.addStudent(firstName, lastName, username, password).subscribe({
        next: data => {
          this.form.userid=data.id;
          this.isUserCreated = true;
          this.isSignUpFailed = false;
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      });
    } else {
      var f=this.form;
      f.diagnoses = f.diagnoses.join(',');
      console.log(f);

      this.authService.saveStudent(this.form.userid, this.form).subscribe({
        next: data => {
          this.isUserUpdated = true;
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: err => {
          this.isSignUpFailed = true;
          this.errorMessage = err.error.message;
        }
      });
    }
  }

  closeNav():void {
    this.router.navigate(['/students']);
  }
}

