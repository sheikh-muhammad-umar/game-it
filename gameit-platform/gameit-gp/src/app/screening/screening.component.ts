import { Component, OnInit } from '@angular/core';
import { Model, SurveyNG, StylesManager } from "survey-angular";
import surveyJSON from '../../dist/json/screening.json';

StylesManager.applyTheme("modern");

//var surveyJSON = {"logoPosition":"right","pages":[{"name":"page1","elements":[{"type":"radiogroup","name":"Q1","title":{"default":"Does your child respond when you call his/her name (with a norm volume of voice) ?","ar":"يستجيب حين تتم مناداته باسمه \"بصوت في مستوى طبيعي من العلو\""},"isRequired":true,"choices":[{"value":"Yes","text":{"ar":"نعم"}},{"value":"No","text":{"ar":"لا"}}]},{"type":"radiogroup","name":"Q2","title":{"default":"Sensitive towards the sound effects (so he closes his/her ears even if hears normal sound’s volume)?","ar":"لديه تحسس من المثيرات الصوتية فيغلق أذنيه مثلاً إذ سمع أصوات في النطاق الطبيعي"},"isRequired":true,"choices":[{"value":"Yes","text":{"ar":"نعم"}},{"value":"No","text":{"ar":"لا"}}]}]}],"widthMode":"responsive"};

function sendDataToServer(survey: { data: any; }) {
    //send Ajax request to your web server
    //alert("The results are: " + JSON.stringify(survey.data));
}

@Component({
  selector: 'app-screening',
  templateUrl: './screening.component.html',
  styleUrls: ['./screening.component.scss']
})
export class ScreeningComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var lang = localStorage.getItem("language");
    if (lang=== null) lang="en";

    var survey = new Model(surveyJSON);
    survey.onComplete.add(sendDataToServer);
    survey.locale=lang;
    SurveyNG.render("surveyElement", { model: survey });
  }

}
