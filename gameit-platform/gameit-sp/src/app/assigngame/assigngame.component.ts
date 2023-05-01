import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-assigngame',
  templateUrl: './assigngame.component.html',
  styleUrls: ['./assigngame.component.scss']
})


export class AssigngameComponent implements OnInit {

  form: any = {
    studentId: null,
    gameId:null,
    instructions: null
  };

  students:Student[]=[];

  constructor(private authService: AuthService,private _Activatedroute:ActivatedRoute, private router: Router) { }

  isSuccessful = false;
  isAssignFailed = false
  errorMessage = '';

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.form.gameId = params.get('id'); 
    }); 
    console.log(this.form);
    this.getStudents();
  }

  getStudents() {
    console.log('get students');
    this.authService.students().subscribe({
      next: data => {
        this.students = data;
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  onSubmit(): void {
    console.log('onSubmit',this.form);
    this.authService.assignGameToStudent(this.form).subscribe({
      next: data => {
        console.log("assign success");
        this.isSuccessful = true;
      },
      error: err => {
        console.log("save error");
        this.errorMessage = err.error.message;
      }
    });
  }

  closeNav():void {
    console.log('closeNav');
    this.router.navigate(['/game', this.form.gameId]);
  }
}
