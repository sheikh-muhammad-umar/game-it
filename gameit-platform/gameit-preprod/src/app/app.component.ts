import { AfterViewInit, Component, OnInit } from '@angular/core';
import {} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TokenStorageService } from './_services/token-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GameIT';
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  role?: string;

  constructor(private tokenStorageService: TokenStorageService,   
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
) {let lang = localStorage.getItem("language");
console.log("lang:" + lang);

if (lang === null) { 
  this.changeLangage("en");
  console.log("lang: en");
  window.location.reload();
}
else {
  this.changeLangage(lang);
  console.log("lang:" + lang);

} }

  isDefaultLang(lang: string)  {
    return this.translateService.getDefaultLang() === lang  ;
  }

  changeLangage(lang: string) {
    let htmlTag = this.document.getElementsByTagName(
      "html"
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    localStorage.setItem("language", lang);
    this.changeCssFile(lang);
    
  }

  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      "head"
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      "langCss"
    ) as HTMLLinkElement;

    let bundleName = lang === "ar" ? "assets/css/style-ar.css" : "assets/css/style.css";

    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }



  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}