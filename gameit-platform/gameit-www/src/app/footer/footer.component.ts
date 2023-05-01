import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
    
  ngAfterViewInit(){
    console.log("after view init");
    let lang = localStorage.getItem("language");
    let bundleName = lang === "ar" ? "assets/js/script-ar.js" : "assets/js/script.js";
    this.addCustomScripts(bundleName);
    //this.addCustomScripts("assets/js/script.js");
  }

  addCustomScripts(src: string){
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = src;
    var s = document.getElementsByTagName('script')[0];
    // @ts-ignore: Object is possibly 'null'.
    s.parentNode?.append(po, s);
  }

}
