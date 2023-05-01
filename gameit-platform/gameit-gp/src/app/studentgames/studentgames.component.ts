import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../_services/auth.service';
import mvpGamesData from '../../dist/json/mvp-games-data.json';
import {DomSanitizer} from '@angular/platform-browser';

interface StudentGame {
  id: number,
  ability: string,
  description: string,
  version: any,
  image: string,
  studentGameId: number,
  instructions: string,
  gameSessionKey: string
}

@Component({
  selector: 'app-studentgames',
  templateUrl: './studentgames.component.html',
  styleUrls: ['./studentgames.component.scss']
})
export class StudentgamesComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<number>();
  @Input()  selectedStudentId!: number;
  
  form: any = {
    studentId: null,
    gameId:null,
    instructions: null
  };

  constructor(private authService: AuthService,private modalService: NgbModal, private sanitizer:DomSanitizer){
  }
  
  studentGames:StudentGame[]=[];
  selectedGameId=0;
  games = null;

  ngOnInit(): void {
    this.getStudentGames();
  }

  ngAfterViewInit(): void {
   
  }
  
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  filterMvpGamesData() {
      var lang = localStorage.getItem("language");
      if (lang=== null) lang="en";
      return mvpGamesData[lang].filter((object: { id: number; }) => {
          console.log(object);
          return this.isGameAssigned(object.id);
      });
  }

  getStudentGames() {
    console.log('get student games');
    this.authService.studentGames(this.selectedStudentId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.studentGames = data;
        this.games = this.filterMvpGamesData();
      },
      error: (err: { error: { message: any; }; }) => {
        console.log(err.error.message);
      }
    });

  }

  getStudentGameId(id:number): number {
    const item = this.studentGames.find(item => { return item.id == id });
    if (item!==undefined) {
       return item.studentGameId;  
    }
    return 0;
  }

  gameInstructions(id:number): string {
    var res='';
    const item = this.studentGames.find(item => { return item.id == id });

    if (item != undefined) {
      res = item.instructions;
    }

    return res;
  }

  gameSessionKey(id:number): string {
    var res='';
    const item = this.studentGames.find(item => { return item.id == id });

    if (item != undefined) {
      res = item.gameSessionKey;
    }

    return res;
  }

  isGameAssigned(id:number): boolean {
    return this.studentGames.find(item => { return item.id == id }) != undefined;
  }

  selected(value: number) {
    this.newItemEvent.emit(value);
  }

  openModalDialog(content: any, id:number ) {
    this.selectedGameId = id;
    const myModal = this.modalService.open(content, { size: 'lg' });
    myModal.hidden.subscribe(result => {
      this.getStudentGames();
    });
  }

}
