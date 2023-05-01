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
import { BoardComponent } from './board/board.component';
import { PreRegisterComponent } from './pre-register/pre-register.component';

const routes: Routes = [
  {path:'', redirectTo: '/home', pathMatch: 'full' },
  {path:'home',component:HomeComponent},
  {path:'story',component:StoryComponent},
  {path:'team',component:TeamComponent},
  {path:'solution',component:SolutionComponent},
  {path:'innovation',component:InnovationComponent},
  {path:'blog',component:BlogComponent},
  {path:'contact',component:ContactComponent},
  //{path:'login',component:LoginComponent},
  //{path:'register',component:RegisterComponent},
  //{path:'verify',component:VerifyComponent},
  //{path:'board',component:BoardComponent}
  {path:'pre-register',component:PreRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
