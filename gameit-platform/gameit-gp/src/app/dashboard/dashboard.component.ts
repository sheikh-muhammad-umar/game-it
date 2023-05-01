import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import * as moment from 'moment';
import * as daterangepicker from 'daterangepicker';
import * as Chartist from 'chartist';
import mvpGamesData from '../../dist/json/mvp-games-data.json';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  @ViewChild('rangeSelection')
  rangeSelection!: ElementRef;

  form: any = {
    birthdate: null,
    city: null,
    country: null,
    diagnoses: null,
    firstName: null,
    lastName: null,
    school: null,
    username: null
  };

  students:Student[]=[];
  gameSession= [];

  sDate = '';
  eDate = '';
  
  selectedRowIds: Set<number> = new Set<number>();
  
  selectedStudentId = 0;
  selectedGameId = 1;

  totalTimePlayed='0h';
  avgTimePlayed='0h';
  avgScorePercent='0%'

  scoresByLevel= {'easy':0,'medium':0,'hard':0};

  totalMistakes!:string;
  totalWhiteCrystal!:string;
  totalBlueCrystal!:string;
  interval: any;
  studentId:any;
  isEnabled=false;

  username!:string;
  role!:string;

  studentFullname='';

  mvpGameList=null;

  constructor(private authService: AuthService, private _Activatedroute:ActivatedRoute, private tokenStorageService: TokenStorageService,private router:Router, private elem: ElementRef){
    var lang = localStorage.getItem("language");
    if (lang=== null) lang="en";
    this.mvpGameList = mvpGamesData[lang];  
  }

  ngOnInit(): void {
    console.log(this.mvpGameList);

    var isLoggedIn = !!this.tokenStorageService.getToken();

    if (isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.role = user.role;
      this.username = user.firstname;
      
    }
    else {
      //window.location.href = "/login";
    }

    this._Activatedroute.paramMap.subscribe(params => { 
      this.selectedStudentId = 0;
      this.studentId = params.get('id'); 
      if (this.studentId!=null) {
        this.isEnabled = true;
        this.selectedStudentId = this.studentId;
        this.getStudent(this.studentId);
      }
      
      console.log("init dashboard enabled",this.studentId);
    }); 
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.dasboardInit();
  }

  loginAsChild(childUser:string): void {
    this.tokenStorageService.signOut();
    window.location.href = "/login?role=student&username=" + childUser;
  }

  dasboardInit(): void {
    if (this.selectedGameId>0) {
      console.log('dasboard init');
      var lang = localStorage.getItem("language");
      if (lang=== null) lang="en";
      var mvpGame = mvpGamesData[lang].filter((object: { [x: string]: number; }) => {
        return object['id'] == this.selectedGameId;
      });
  
      var item = mvpGame[0];
  
      console.log(item.title, '-', this.sumTest(item.levels, "activityTotal"), "-", this.sumTest(item.levels, "whiteCrystalTotal")) ;

        this.loadChart();
        this.getGameSession();
      /*this.interval = setInterval(() => { 
        this.getGameSession(); 
      }, 5000);
      */
      var start = moment().subtract(6, 'days');
      var end = moment();

      $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      }, this.cb);
      
      $(this.rangeSelection.nativeElement).on('change', (e) => {
        this.rangeSelected(e);
      });

      this.cb(start, end);
    }
  }

  cb(start: { format: (arg0: string) => string; }, end: { format: (arg0: string) => string; }) {
    $('#reportrange span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
    $('#rangeSelection').val( start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD')).change();

  }

  updateGameId(value:number) {
    console.log('Selected Game ID:',value);
    this.selectedGameId = value;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    setTimeout(() =>{ this.dasboardInit(); }, 0);

  }

  rangeSelected(val: any) {
    console.log(this.rangeSelection.nativeElement.value);
  }

  getStudents() {
    console.log('get students');
    this.authService.students().subscribe({
      next: data => {
        this.students = data;
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  getStudent(id:  number  ) {

    this.authService.getStudent(id).subscribe({
      next: data => {
        this.form = data;
      },
      error: err => {
        console.log(err.error.message);
      }
    });

  }

  getGameSession() {
    if (this.selectedGameId!==0) {
      this.authService.getGameSession(this.selectedStudentId,this.selectedGameId).subscribe({
        next: data => {
          this.gameSession = data;
          this.calculateResults();      
        },
        error: err => {
          console.log(err.error.message);
        }
      });
    }
    else {
      this.authService.getGameSessionAll(this.selectedStudentId).subscribe({
          next: data => {
            this.gameSession = data;
            this.calculateResults();
          },
          error: err => {
            console.log(err.error.message);
          }
        });
    }

  }

  filterData(type: any) {
    return this.gameSession.filter(object => {
        return object['sessionType'] == type;
    });
}

 groupBySessionType(objectArray: any[]) {
  return objectArray.reduce(function(acc, obj) {
      var key = obj.sessionType;
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
  }, {});
}

 groupBy(objectArray:any, property:any) {
  return objectArray.reduce(function(acc: { [x: string]: any[]; }, obj: { sessionData: { [x: string]: any; }; }) {
      var key = obj.sessionData[property];
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
  }, {});
}

sumTest(newData: any, field: any) {
  let sum = 0;
    newData.forEach((item: { [x: string]: number; }) => { sum += item[field] });
    return sum;
}

 sum(newData: any, field: any) {
    let sum = 0;
//    const newData = this.filterData(type)
    newData.forEach((item: { [x: string]: { [x: string]: number; }; }) => { sum += item['sessionData'][field] });
 
    return sum;
  }

calculateResults() {
  this.totalTimePlayed='0h';
  this.avgTimePlayed='0h';
  this.avgScorePercent='0%'
  this.totalMistakes='0';
  this.scoresByLevel.easy=0;
  this.scoresByLevel.medium=0;
  this.scoresByLevel.hard=0;
  this.updateCharts();

  if (this.gameSession.length>0) {
    var progressData = this.groupBySessionType(this.gameSession)['progress'];
    var groupedData = this.groupBy(progressData, 'sessionId');
    var groupedByLevel = this.groupBy(progressData, 'difficultyLevel');

    var numberOfSessions = 0;
    var totalTimePlayed=0;
    var totalMistakes = 0;
    var totalScorePercent=0;
    const formatter = Intl.NumberFormat('en-US', {
      style: 'percent',
    })

    Object.keys(groupedData).forEach((k) => {
      const spentTime = this.sum(groupedData[k], 'spentTime');
      const whiteCrystals = this.sum(groupedData[k], 'whiteCrystalNum');
      const mistakes = this.sum(groupedData[k], 'mistakesNum');
      const totalWC = (mistakes * 2) + whiteCrystals;
      const scorePercent = whiteCrystals / totalWC;

      totalTimePlayed += spentTime;
      totalMistakes = mistakes;
      totalScorePercent += scorePercent;
      numberOfSessions +=1;
    });

    Object.keys(groupedByLevel).forEach((k) => {
      const spentTime = this.sum(groupedByLevel[k], 'spentTime');
      const whiteCrystals = this.sum(groupedByLevel[k], 'whiteCrystalNum');
      const mistakes = this.sum(groupedByLevel[k], 'mistakesNum');
      const totalWC = (mistakes * 2) + whiteCrystals;
      const scorePercent = whiteCrystals / totalWC;
      if (k==='easy') this.scoresByLevel.easy = parseInt((scorePercent*100).toFixed());
      if (k==='medium') this.scoresByLevel.medium = parseInt((scorePercent*100).toFixed());
      if (k==='hard') this.scoresByLevel.hard = parseInt((scorePercent*100).toFixed());

    });
    this.totalMistakes = totalMistakes.toString();
    this.totalTimePlayed = this.formatTimePlayed(totalTimePlayed);
    this.avgScorePercent = formatter.format(totalScorePercent/numberOfSessions);
    this.avgTimePlayed =  this.formatTimePlayed(totalTimePlayed/numberOfSessions); 
    this.updateCharts();
   }
  }

  formatTimePlayed(timePlayed:any): string{
    const inMinutes = Math.floor(timePlayed / 60); 
    var result='0h';
    if (inMinutes > 59) {
      var inHours = Math.floor(inMinutes / 60);  
      var minutes = inMinutes - (inHours * 60);
      result = inHours + 'h' + minutes; 
    } else {
      result = inMinutes + 'm' ;
    }
    return result;
  }

  userSelect(id: any) {
    console.log('Selected User ID:',id)

    this.selectedStudentId = id;
    this.getGameSession();

  }

  gameSelect(id: any) {
    console.log('Selected Game ID:',id)
    this.selectedGameId = id;
    this.dasboardInit();
  }

  skillSelect(id: any) {
    console.log('Selected Skill ID:',id)
    //this.selectedGameId = id;
    //this.getGameSession();
  }

  updateCharts(){
    console.log('update charts');
    let element = this.elem.nativeElement.querySelector('.perf-level');
    element.__chartist__.update({
      labels: ["Easy", "Medium", "Hard"],
      series: [
          [this.scoresByLevel.easy, this.scoresByLevel.medium, this.scoresByLevel.hard]
      ]
    });

  }

  
  loadChart()
  {

    var chart = new Chartist.Line('.perf-skill', {
      series: [
        {
          name: 'visual skills',
          data: [
            {x: new Date('2022-02-14'), y: 0},
            {x: new Date('2022-02-15'), y: 0},
            {x: new Date('2022-02-16'), y: 0},
            {x: new Date('2022-02-17'), y: 0},
            {x: new Date('2022-02-18'), y: 0},
            {x: new Date('2022-02-19'), y: 0},
            {x: new Date('2022-02-20'), y: 0}
          ]
        },
        {
          name: 'spatial skills',
          data: [
            {x: new Date('2022-02-14'), y: 0},
            {x: new Date('2022-02-15'), y: 0},
            {x: new Date('2022-02-16'), y: 0},
            {x: new Date('2022-02-17'), y: 0},
            {x: new Date('2022-02-18'), y: 0},
            {x: new Date('2022-02-19'), y: 0},
            {x: new Date('2022-02-20'), y: 0}
          ]
        },
        {
          name: 'memory skills',
          data: [
            {x: new Date('2022-02-14'), y: 0},
            {x: new Date('2022-02-15'), y: 0},
            {x: new Date('2022-02-16'), y: 0},
            {x: new Date('2022-02-17'), y: 0},
            {x: new Date('2022-02-18'), y: 0},
            {x: new Date('2022-02-19'), y: 0},
            {x: new Date('2022-02-20'), y: 0}
          ]
        }
      ]
    }, {
      axisX: {
        type: Chartist.FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: function(value: moment.MomentInput) {
          return moment(value).format('ddd');
        }
      }
    });
  
    new Chartist.Bar('.perf-level', {
      labels: ["Easy", "Medium", "Hard"],
      series: [
          [0, 0, 0]
      ]
      }, {
          seriesBarDistance: 10,
          axisX: {
            offset: 60
          },
          axisY: {
            offset: 80,
            labelInterpolationFnc: function(value: number) {
              const formatter = Intl.NumberFormat('en-US', {
                style: 'percent',
              })

              return formatter.format(value);
              
            },
            scaleMinSpace: 15
          }
        });

  }

}
