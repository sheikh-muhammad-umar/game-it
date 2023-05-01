import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private tokenStorageService: TokenStorageService,private router: Router) { }
  
  selectedStudentId = 0;
  selectedGameId = 0;

  totalTimePlayed!:string;
  totalMistakes!:string;
  totalWhiteCrystal!:string;
  totalBlueCrystal!:string;
  interval: any;

  ngOnInit(): void {
    
    this.totalTimePlayed='0h';
    this.totalMistakes='0';
    this.totalWhiteCrystal='0';
    this.totalBlueCrystal='0';
  
    var isLoggedIn = !!this.tokenStorageService.getToken();

    if (isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      
      if (user.role!=='student') {
        this.router.navigate(['dashboard/']);
      } else {

        this.selectedStudentId = user.id;

      }

    }
  }

  updateGameId(value:number) {
    console.log('Selected Game ID:',value);
    this.selectedGameId = value;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    setTimeout(() =>{ console.log('student dashboard init'); }, 0);

  }

}
