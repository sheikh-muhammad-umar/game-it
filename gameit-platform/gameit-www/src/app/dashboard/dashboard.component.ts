import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  numOfStudents = 0;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getStudents();
  }
  getStudents() {
    console.log('get students');
    this.authService.students().subscribe({
      next: data => {
        console.log(data);
        this.numOfStudents = data.length;
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }
  gotoStudents(){
    this.router.navigate(['/board/students']);
  }
}
