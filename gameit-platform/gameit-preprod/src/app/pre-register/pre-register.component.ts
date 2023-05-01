import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-pre-register',
  templateUrl: './pre-register.component.html',
  styleUrls: ['./pre-register.component.css']
})
export class PreRegisterComponent implements OnInit {
  form: any = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    role: ''
  };

  userEmail = '';
  userRole = '';
  isSuccessful = false;
  isSignUpFailed = false;
  isGuardian = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  setRole(role:string):void{
    this.userRole=role;
    this.isGuardian = this.userRole==='Guardian';
  }

  onSubmit(): void {

    const { firstname, lastname, email, phone, role } = this.form;
    
    this.authService.preregister(firstname, lastname, email, phone, this.userRole).subscribe({
      next: data => {
        console.log("successfuly registered");
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        console.log("failed to register");
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
