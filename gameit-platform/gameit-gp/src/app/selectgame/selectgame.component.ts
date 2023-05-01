import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../_services/auth.service';

interface StudentGame {
  id: number,
  ability: string,
  description: string,
  version: any,
  image: string,
  studentGameId: number,
  instructions: string
}

@Component({
  selector: 'app-selectgame',
  templateUrl: './selectgame.component.html',
  styleUrls: ['./selectgame.component.scss']
})

export class SelectgameComponent implements OnInit,OnChanges {
  @Output() newItemEvent = new EventEmitter<number>();
  @Input()  selectedStudentId!: number;
  
  form: any = {
    studentId: null,
    gameId:null,
    instructions: null
  };

  myModal!:NgbModalRef;
  selectedGameId = 0;

  constructor(private authService: AuthService,private modalService: NgbModal){}
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('select game student changed');
    this.getStudentGames();
  }

  studentGames:StudentGame[]=[];


  ngOnInit(): void {
    console.log('select game student init');
  }

  getStudentGames() {
    console.log('get student games');
    this.authService.studentGames(this.selectedStudentId).subscribe({
      next: (data: any) => {
        console.log(data);
        this.studentGames = data;
      },
      error: (err: { error: { message: any; }; }) => {
        console.log(err.error.message);
      }
    });

  }

  isGameAssigned(id:number): boolean {
    return this.studentGames.find(item => { return item.id == id }) != undefined;
  }

  getStudentGameId(id:number): number {
    const item = this.studentGames.find(item => { return item.id == id });
    if (item!==undefined) {
       return item.studentGameId;  
    }
    return 0;
  }

  selected(value: number) {
    this.newItemEvent.emit(value);
  }

  openModalDialog(content: any, id:number ) {
    this.selectedGameId = id;
    this.myModal = this.modalService.open(content, { size: 'lg' });
    this.myModal.hidden.subscribe(result => {
      this.getStudentGames();
    });
  }


}
