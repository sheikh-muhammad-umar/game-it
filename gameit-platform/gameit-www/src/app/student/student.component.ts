import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit , AfterViewInit{
  form: any = {
    birthdate: null,
    city: null,
    country: "Saudi Arabia",
    diagnoses: null,
    firstName: null,
    lastName: null,
    school: null,
    username: null
  };
  
  isSuccessful = false;
  isDeleted = false;
  isReadOnly = true;
  isSignUpFailed = false;

  errorMessage = '';

  constructor(private authService: AuthService,private _Activatedroute:ActivatedRoute, private router: Router) { }

  ngAfterViewInit(): void {
    
  }

  studentId:any;

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.studentId = params.get('id'); 
      if (this.studentId !== null) {
        this.form = this.getStudent(this.studentId);
      }
    }); 
  }

  getStudent(id:  number  ) {

    this.authService.getStudent(id).subscribe({
      next: data => {
        this.form = data;
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  deleteStudent(id:number) {
    this.authService.deleteStudent(id).subscribe({
      next: data => {
        console.log(data.message);
        this.isDeleted = true;
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onSubmit(): void {
    this.authService.saveStudent(this.studentId, this.form).subscribe({
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

  closeNav():void {
    this.router.navigate(['/board/students']);
  }

}
