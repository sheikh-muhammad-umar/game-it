import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, QueryList, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { TokenStorageService } from './_services/token-storage.service';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from "@ngx-translate/core";
import { DeviceDetectorService } from 'ngx-device-detector';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('addnewuser')
  addnewuser!: TemplateRef<any>;

  title = 'gameit-mvp';
  isLoggedIn = false;
  username?: string;
  role?: string;
  students:Student[]=[];
  selectedStudent?: string;
  isStudentSelected= false;
  showAddNewUser = true;

  deviceType?: string;
  deviceOS?: string;
  deviceBrowser?: string;

  constructor(private authService: AuthService, private _Activatedroute:ActivatedRoute, public deviceService: DeviceDetectorService,
    private tokenStorageService: TokenStorageService, private router: Router,private modalService: NgbModal,  private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document) {
    let lang = localStorage.getItem("language");
    

    if (lang === null) { 
      this.changeLangage("en");
      console.log("lang: en");
      window.location.reload();
    }
    else {
      this.changeLangage(lang);
      console.log("lang:" + lang);
    
    } 
    console.log(this.deviceService.getDeviceInfo());
   }

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

  ngAfterViewInit(): void {
    
  }
  
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.firstname;
      this.selectedStudent = '';
      if (this.role!=='student') {
        this.getStudents();
      } 
      
    }
    else {
      //window.location.href = "/login";
    }

  }

  getStudents() {
    console.log('get students');
    this.authService.students().subscribe({
      next: data => {
        this.students = data;
        if (this.students.length===0 && this.showAddNewUser) {
          this.openModalDialog(this.addnewuser);
          this.showAddNewUser=false;
        }
        /*
        if (this.students.length===1) {
          this.router.navigate(['dashboard/', this.students[0].id])
        }
        */
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  studentSelected(firstName: any, lastName: any){
    console.log(firstName,lastName);
    this.selectedStudent = firstName + ' ' + lastName;
    this.isStudentSelected = true;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.href = "/";
  }

  openModalDialog(content: any) {
    const myModal = this.modalService.open(content, { size: 'lg' });
    myModal.hidden.subscribe(result => {
      this.getStudents(); 
    });
  }

}
