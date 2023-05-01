import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  role?: string;
  
  constructor(
    private tokenStorageService: TokenStorageService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document

  ) {

    
  }

  isDefaultLang(lang: string)  {
    return this.translateService.getDefaultLang() === lang  ;
  }

  changeLangage(lang: string) {
      localStorage.setItem("language", lang);
      window.location.reload(); 
  }


  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.firstname;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  gotoProfile(): void {
   
    window.location.href='/gp';
    
  }

}
