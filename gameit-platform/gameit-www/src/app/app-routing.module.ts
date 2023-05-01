import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../app/home/home.component';
import {StoryComponent} from '../app/story/story.component';
import {TeamComponent} from '../app/team/team.component';
import {SolutionComponent} from '../app/solution/solution.component';
import {InnovationComponent} from '../app/innovation/innovation.component';
import {BlogComponent} from '../app/blog/blog.component';
import {ContactComponent} from '../app/contact/contact.component';
import {LoginComponent} from '../app/login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BoardComponent } from './board/board.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {StudentsComponent} from './students/students.component';
import {AddstudentComponent} from './addstudent/addstudent.component';
import{StudentComponent} from './student/student.component';
import{UserComponent} from './user/user.component';
import{TermsComponent} from './terms/terms.component';


const routes: Routes = [
  //{path:'', redirectTo: '/home', pathMatch: 'full' },
  {path:'',component:HomeComponent},
  {path:'story',component:StoryComponent},
  {path:'team',component:TeamComponent},
  {path:'solution',component:SolutionComponent},
  {path:'innovation',component:InnovationComponent},
  {path:'blog',component:BlogComponent},
  {path:'contact',component:ContactComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'verify',component:VerifyComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'terms',component:TermsComponent},
  {path:'board',component:BoardComponent,
  children: [
    {
      path: '',
      component: DashboardComponent 
    },
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
    ,
    {
      path: 'user', 
      component: UserComponent
    }
  ],}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
