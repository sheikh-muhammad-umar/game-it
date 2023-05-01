import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ServerCallsService } from 'src/app/_services/server-calls.service';
import { Store } from '@ngrx/store';
import { userRecord } from '../../store/userRecord.action';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss']
})
export class SchoolsComponent implements OnInit {

  public joinSchool: boolean = false;

  public school: FormControl = new FormControl();
  public filteredSchools!: Observable<any[]>;

  public errorMessage = '';
  public isJoiningFailed = false;
  public schools: any = [];

  public form: any = {
    school: {
      city: null,
      name: null,
      schoolId: null
    }
  };

  constructor(
    private serverCallsService: ServerCallsService,
    private userStore: Store<{ user: string }>,
  ) { }

  ngOnInit(): void {
    this.filteredSchools = this.school.valueChanges.pipe(
      startWith(''),
      map(value => value),
      map(name => (name ? this.checkSchools(name) : this.schools.slice())),
    );

    this.userStore.select('user').subscribe(((state: any) => {
      console.log(`state?.User from store`, state);
    }));
  }

  checkSchools(name: any){
    if(name.length >= 2){
      let filteredList = this._filterSchools(name);
      // console.log("filteredList: ", filteredList);
      if(!filteredList.length){
        this.form.school = {
          city: '',
          name: name,
          schoolId: null
        };
      }
    return filteredList;
    }
  }

  private _filterSchools(value: string) {
    const filterValue = value.toLowerCase();

      this.serverCallsService.getSchools(filterValue).valueChanges.subscribe({
          next: (data) => {
            // console.log("School List: ", data.data.listSchools.nodes);
            this.schools = data.data.listSchools.nodes;
            this.schools = this.schools.filter((option: any) => option.name.toLowerCase().includes(filterValue));;
          },
          error: (error) => {
            console.log("Error in getting school list: ", error.message);
            this.errorMessage = error.message;
          }
        });
    return this.schools.filter((option: any) => option.name.toLowerCase().includes(filterValue));
  }

  setCity(school: any){
    this.form.school = {
      city: school.city,
      name: school.name,
      schoolId: school.id
    };
  }

  setJoinRequest(val: boolean){
    this.joinSchool = val;
    if(!val){
      this.school.reset();
      this.form.school = {
        city: null,
        name: null,
        schoolId: null
      }
    }
  }

  onSendRequest(){
    
    if((!this.form.school.name && !this.form.school.city) && !this.form.school.schoolId){
      return;
    }
    console.log("Form: ", this.form);
  }

}
