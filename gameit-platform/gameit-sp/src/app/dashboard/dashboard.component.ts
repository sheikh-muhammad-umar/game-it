import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';


interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  students:Student[]=[];
  gameSession=[];
  
  selectedRowIds: Set<number> = new Set<number>();
  
  selectedStudentId = '4';
  selectedGameId = '1';

  totalTimePlayed!:string;
  totalMistakes!:string;
  totalWhiteCrystal!:string;
  totalBlueCrystal!:string;
  interval: any;

  isLoggedIn = false;
  username?: string;
  role?: string;
  userid?:string;

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService,private router:Router) { 
/*
    this.router.events
    .pipe(filter(event =>
        event instanceof NavigationEnd && event.urlAfterRedirects === '/',
    ))
    .subscribe(() => this.getStudents());
  */    
  }


  ngOnInit(): void {
    console.log('init');

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.username;
      this.userid = user.id;
    }

    this.getStudents();

  }

  ngAfterViewInit(): void {
    this.getGameSession();
    this.interval = setInterval(() => { 
      this.getGameSession(); 
  }, 5000);
   

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

  getGameSession() {
    console.log(new Date(this.sum('progress', 'spentTime') * 1000).toISOString());
    if (this.selectedGameId!=='0') {
      this.authService.getGameSession(this.selectedStudentId,this.selectedGameId).subscribe({
        next: data => {
          this.gameSession = data;
          this.totalTimePlayed = new Date(this.sum('progress', 'spentTime') * 1000).toISOString().substring(11, 19);
          this.totalMistakes = this.sum('progress', 'mistakesNum').toString();
          this.totalWhiteCrystal = this.sum('progress', 'whiteCrystalNum').toString();
          this.totalBlueCrystal = this.sum('milestone', 'blueCrystalNum').toString();
          
        },
        error: err => {
          console.log(err.error.message);
        }
      });
    }
    else {
      this.authService.getGameSessionAll(this.selectedStudentId).subscribe({
          next: data => {
            this.gameSession = data;
            this.totalTimePlayed = new Date(this.sum('progress', 'spentTime') * 1000).toISOString().substring(11,19);
            this.totalMistakes = this.sum('progress', 'mistakesNum').toString();
            this.totalWhiteCrystal = this.sum('progress', 'whiteCrystalNum').toString();
            this.totalBlueCrystal = this.sum('milestone', 'blueCrystalNum').toString();
            
          },
          error: err => {
            console.log(err.error.message);
          }
        });
    }

  }

  filterData(type: any) {
    return this.gameSession.filter(object => {
        return object['sessionType'] == type;
    });
}

 sum(type: any, field: string | number) {
    let sum = 0;
    const newData = this.filterData(type)
    newData.forEach((item) => { sum += item['sessionData'][field] });
    return sum;
  }

  userSelect(id: any) {
    console.log('Selected User ID:',id)

    this.selectedStudentId = id;
    this.getGameSession();

  }

  gameSelect(id: any) {
    console.log('Selected Game ID:',id)

    this.selectedGameId = id;
    this.getGameSession();

  }
  
}
