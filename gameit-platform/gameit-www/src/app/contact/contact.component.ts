import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, NgModel } from '@angular/forms';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  form: any = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  isSuccessful = false;
  isFailed = false;

  constructor(private authService: AuthService) { }
    
  ngOnInit(): void {
  }

  onSubmit(): void {
    const { name, phone, email, message } = this.form;
    console.log(this.form);

    this.authService.contact(name, phone, email, message).subscribe({
      next: data => {
        console.log("successfuly sent");
        this.isSuccessful = true;
        this.isFailed = false;
      },
      error: err => {
        console.log("failed to send");
        this.isSuccessful = false;
        this.isFailed = true;
      }
    });



  }

}
