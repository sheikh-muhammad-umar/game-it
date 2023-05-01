import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  
  isVerified = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params['token']);     
        this.authService.verify(params['token']).subscribe({
          next: data => {
            console.log(data.message);
            if (data.message === "success") {
              this.isVerified = true;
            }
          },
          error: err => {
            console.log(err.error.message);
            this.isVerified = false;
          }
        });
      }
    );
  }

}
