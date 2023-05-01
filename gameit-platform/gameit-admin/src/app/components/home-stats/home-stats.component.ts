import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesStorageService } from '../../_services/cookies-storage.service';
import { ServerCallsService } from '../../_services/server-calls.service';
import * as daterangepicker from 'daterangepicker';
import * as moment from 'moment';
@Component({
  selector: 'app-home-stats',
  templateUrl: './home-stats.component.html',
  styleUrls: ['./home-stats.component.scss'],
})
export class HomeStatsComponent implements OnInit, AfterViewInit {
  @ViewChild('rangeSelection') rangeSelection!: ElementRef;

  selectedStudentId = 0;
  selectedGameId = 0;

  public averageTime!: number;
  public playTime!: string;
  public totalGamesDownloaded!: number;
  public totalStudents!: number;
  public totalGuardians!: number;
  public interval: any;
  public totalUsers!: number;
  public totalNewUsers!: number;
  public usersByCountry: any;
  public dateRange: any;

  public wid = 'width:';
  elements: any = [
    { Country: 'Pakistan', Users: 12 },
    { Country: 'UAE', Users: 24 },
    { Country: 'Canada', Users: 10 },
  ];

  headElements = ['Country', 'Users'];

  constructor(
    private cookiesStorageService: CookiesStorageService,
    private router: Router,
    private serverCallsService: ServerCallsService
  ) {
    this.dateRange = ['2022-04-02', '2022-04-08'];
    $(function () {
      (<any>$('[data-toggle="tooltip"]')).tooltip()
    })
  }

  ngOnInit(): void {
    this.getStats();
    // this.getGoogleStats();
  }

  ngAfterViewInit(): void {
    this.dasboardInit();
  }

  dasboardInit() {
    var start = moment().subtract(6, 'days');
    var end = moment();

    $('#reportrange').daterangepicker(
      {
        startDate: start,
        endDate: end,
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
          ],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month'),
          ],
        },
      },
      this.cb
    );

    $(this.rangeSelection.nativeElement).on('change', (e) => {
      this.rangeSelected(e);
    });

    this.cb(start, end);
  }

  cb(
    start: { format: (arg0: string) => string },
    end: { format: (arg0: string) => string }
  ) {
    $('#reportrange span').html(
      start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY')
    );
    $('#rangeSelection')
      .val(start.format('YYYY-MM-DD') + 'to' + end.format('YYYY-MM-DD'))
      .change();
  }

  rangeSelected(val: any) {
    this.dateRange = this.rangeSelection.nativeElement.value.split('to');

    this.getStats();
    // this.getGoogleStats();
  }

  getStats() {
    const self = this;
    this.serverCallsService.getStats(this.dateRange).subscribe({
      next(res: any) {
        self.totalGamesDownloaded = res.data.totalGameDownloads;
        self.totalStudents = res.data.studentsCount;
        self.totalGuardians = res.data.guardiansCount;
        self.playTime = self.convertSecondsToHm(res.data.playTime);
      },
      error(error) {
        console.log('Error in getStats(): ', error);
      },
    });
  }

  convertSecondsToHm(d: any) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + 'h' : '';
    var mDisplay = m > 0 && h <= 0 ? m + 'm ' : m;
    return hDisplay + mDisplay;
  }

  getGoogleStats() {
    const self = this;
    this.serverCallsService.totalUsersByGoogle(this.dateRange).subscribe({
      next(res: any) {
        self.totalUsers = res.data[0].users;
      },
      error(error) {
        console.log('Error in getGoogleStats(): ', error);
      },
    });

    this.serverCallsService.newUsersByGoogle(this.dateRange).subscribe({
      next(res: any) {
        self.totalNewUsers = res.data.new;
      },
      error(error) {
        console.log('Error in getGoogleStats(): ', error);
      },
    });
  }
}
