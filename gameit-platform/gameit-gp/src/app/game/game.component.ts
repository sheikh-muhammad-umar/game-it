import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() selectedGameId!: number;
  constructor() { }

  ngOnInit(): void {
    console.log('game:', this.selectedGameId);
  }


}
