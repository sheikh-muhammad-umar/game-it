import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  isInProgress = false;
  isSubmitted = false;
  isVerified = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  proceed() {

    if (!this.isSubmitted) {
      this.isSubmitted=true;
      this.isInProgress=true;

      this.route.queryParams
        .subscribe(params => {
          console.log(params['token']);     
          this.authService.verify(params['token']).subscribe({
            next: data => {
              console.log(data.message);
              this.isInProgress=false;
              if (data.message === "success") {
                this.isVerified = true;
              }
            },
            error: err => {
              console.log(err.error.message);
              this.isInProgress=false;
              this.isVerified = false;
            }
          });
        }
      );
    }
  }

}
