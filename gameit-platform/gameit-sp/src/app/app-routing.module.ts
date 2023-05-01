import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { AssigngameComponent } from './assigngame/assigngame.component';
import { LogoutComponent } from './logout/logout.component';
import { StudentComponent } from './student/student.component';
import { StudentsComponent } from './students/students.component';

const routes: Routes = [ 
  {path:'',component:DashboardComponent},
  {path:'logout',component:LogoutComponent},
  {path:'games',component:GamesComponent},
  {path: 'game/:id', component: GameComponent},
  {path: 'assigngame/:id', component: AssigngameComponent},

  {path:'stages',component:GamesComponent},
  {
    path: 'students', 
    component: StudentsComponent,
    children: [
      {
        path: 'addstudent', 
        component: AddstudentComponent 
      },
      {
        path: 'student/:id', 
        component: StudentComponent 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
