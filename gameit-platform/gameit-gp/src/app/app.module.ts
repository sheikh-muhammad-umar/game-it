import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { StudentComponent } from './student/student.component';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { LogoutComponent } from './logout/logout.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { AssigngameComponent } from './assigngame/assigngame.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectgameComponent } from './selectgame/selectgame.component';
import { HomeComponent } from './home/home.component';
import { StudentgamesComponent } from './studentgames/studentgames.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';
import { ScreeningComponent } from './screening/screening.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { LibraryComponent } from './library/library.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StudentsComponent,
    StudentComponent,
    AddstudentComponent,
    LogoutComponent,
    GamesComponent,
    GameComponent,
    AssigngameComponent,
    SelectgameComponent,
    HomeComponent,
    StudentgamesComponent,
    TermsconditionsComponent,
    ScreeningComponent,
    UpcomingComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
