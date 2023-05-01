import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  TemplateRef,
  QueryList,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './_services/auth.service';
import { ServerCallsService } from './_services/server-calls.service';
import { CookiesStorageService } from './_services/cookies-storage.service';
import { DOCUMENT } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
  isFirstLogin = false;
  isShowHeader = false;
  onResetPass = false;
  user?: any;
  role?: string;
  students: Student[] = [];
  selectedStudent?: string;
  isStudentSelected = false;
  showAddNewUser = true;
  register = false;

  deviceType?: string;
  deviceOS?: string;
  deviceBrowser?: string;

  constructor(
    private authService: AuthService,
    private _Activatedroute: ActivatedRoute,
    public deviceService: DeviceDetectorService,
    private cookiesStorageService: CookiesStorageService,
    private router: Router,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private serverCallsService: ServerCallsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    let lang = localStorage.getItem('language');

    if (lang === null) {
      this.changeLangage('en');
      // console.log('lang: en');
      window.location.reload();
    } else {
      this.changeLangage(lang);
      // console.log('lang:' + lang);
    }

    this.isLoggedIn = !!this.cookiesStorageService.getCookie('auth-token');

    this.router.events.subscribe((event: any) => {
      if (event.url) {
        const URL: string = event.url;

        if (this.isLoggedIn) {
          this.isShowHeader = true;
          this.onResetPass = false;
        }
        if (URL == '/login' && this.isLoggedIn) {
          this.router.navigate(['/']);
        }
        if (URL == '/login' && !this.isLoggedIn) {
          this.isShowHeader = false;
          this.onResetPass = false;
        }
        if (URL.includes('/reset-password') && !this.isLoggedIn) {
          this.isShowHeader = false;
          this.onResetPass = true;
        }
        if (URL == '/register' && !this.isLoggedIn) {
          this.register = true;
          this.onResetPass = false;
          this.isShowHeader = false;
        }
      }
    });
  }

  isDefaultLang(lang: string) {
    return this.translateService.getDefaultLang() === lang;
  }

  changeLangage(lang: string) {
    let htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
    localStorage.setItem('language', lang);
    this.changeCssFile(lang);
  }

  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName(
      'head'
    )[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById(
      'langCss'
    ) as HTMLLinkElement;

    let bundleName =
      lang === 'ar' ? 'assets/css/style-ar.css' : 'assets/css/style.css';

    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
  }

  ngAfterViewInit(): void {
    if(this.isFirstLogin){
      this.router.navigate(['/change-password']);
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.user = this.serverCallsService.getUser().subscribe({
        next: (data: any) => {
          this.user = data.user;
          this.isFirstLogin = data.user.flags.passwordChangeRequired;
          if(data.user.flags.passwordChangeRequired){
            this.router.navigate(['/change-password']);
          }
        },
        error: (error) => {
          console.log('Error in getting User info: ', error);
        },
      });
    }
  }

  checkLoggedInUser(data: any) {
    this.isFirstLogin= data.isFirstLogin;
    this.isLoggedIn = data.loggedIn;
    this.user = data.user;
    this.isShowHeader = true;
    if(data.isFirstLogin){
      this.router.navigate(['/change-password']);
    }
  }

  studentSelected(firstName: any, lastName: any) {
    console.log(firstName, lastName);
    this.selectedStudent = firstName + ' ' + lastName;
    this.isStudentSelected = true;
  }

  logout(): void {
    this.cookiesStorageService.removeCookie('auth-token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  openModalDialog(content: any) {
    const myModal = this.modalService.open(content, { size: 'lg' });
    myModal.hidden.subscribe((result) => {
      // this.getStudents();
    });
  }

  passwordChanged(data: any){
    this.isFirstLogin = data.isFirstLogin;
  }
}
