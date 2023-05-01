import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private authService: AuthService,private _Activatedroute:ActivatedRoute, private router: Router) { }

  gameId:any;
  assignOn=false;

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe(params => { 
      this.gameId = params.get('id'); 
    }); 
  }

  assignOpen() {
    this.assignOn = true;
  }

  assignClose() {
    alert('close');
    this.assignOn = false;
  }

}
