import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})

export class StudentsComponent implements OnInit ,AfterViewInit{

  students:Student[]=[];
  selectedRowIds: Set<number> = new Set<number>();
  selectedId: string;

  onRowClick(id: number) {
    if(this.selectedRowIds.has(id)) {
     this.selectedRowIds.delete(id);
    }
    else {
      this.selectedRowIds.add(id);
    }
  }

  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }

  getSelectedRows(){
    return this.students.filter(x => this.selectedRowIds.has(x.id));
  }
  
  constructor(private authService: AuthService, private router:Router) { 

    this.router.events
    .pipe(filter(event =>
        event instanceof NavigationEnd && event.urlAfterRedirects === '/board/students',
    ))
    .subscribe(() => this.getStudents());
      
  }
  
  ngAfterViewInit(): void {
    console.log('afterviewinit');
  }

  ngOnInit(): void {
    console.log('init');
    this.getStudents();
  }

  getStudents() {
    console.log('get students');
    this.authService.students().subscribe({
      next: data => {
        console.log(data);
        this.students = data;
        console.log(this.students);

      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  deleteStudents() {

    for (let student of this.getSelectedRows()) {
      this.authService.deleteStudent(student.id).subscribe({
        next: data => {
          this.students = data;
        },
        error: err => {
          console.log(err.error.message);
        }
      });

    }

  }

}
