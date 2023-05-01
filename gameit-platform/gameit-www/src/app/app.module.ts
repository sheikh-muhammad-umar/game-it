import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { StoryComponent } from './story/story.component';
import { TeamComponent } from './team/team.component';
import { SolutionComponent } from './solution/solution.component';
import { InnovationComponent } from './innovation/innovation.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { VerifyComponent } from './verify/verify.component';
import { BoardComponent } from './board/board.component';
import { PreRegisterComponent } from './pre-register/pre-register.component';
import { StudentsComponent } from './students/students.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentComponent } from './student/student.component';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { UserComponent } from './user/user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TermsComponent } from './terms/terms.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NavBarComponent,
    StoryComponent,
    TeamComponent,
    SolutionComponent,
    InnovationComponent,
    BlogComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    VerifyComponent,
    BoardComponent,
    PreRegisterComponent,
    StudentsComponent,
    DashboardComponent,
    AddstudentComponent,
    StudentComponent,
    UserComponent,
    ResetPasswordComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectCountryModule.forRoot('de'),
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
