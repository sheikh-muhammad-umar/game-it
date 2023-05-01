import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/auth.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ServerCallsService } from 'src/app/_services/server-calls.service';
import { LocationServiceService } from 'src/app/_services/location-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  public country: FormControl = new FormControl();
  public school: FormControl = new FormControl();

  public filteredCountries!: Observable<any[]>;
  public filteredSchools!: Observable<any[]>;

  public form: any = {
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    password: null,
    read_terms: null,
    country: null,
    city: null,
    role: null,
    code: null,
    school: {
      city: null,
      name: null,
      schoolId: null
    }
  };
  public formStep = 1;

  public userEmail = '';
  public isSuccessful = false;
  public isSignUpFailed = false;
  public errorMessage = '';

  public currentCountry: any;

  public countries = [];
  public schools: any = [];
  public roles = [
    "TEACHER", "SCHOOL_ADMIN",
	  "GUARDIAN",
	  "STUDENT",
  ]

  constructor(
    private authService: AuthService,
    private serverCallsService: ServerCallsService,
    private locationServiceService: LocationServiceService
    ) {
      this.serverCallsService.getCountries().valueChanges.subscribe(
        ({data}) => {
          this.countries = data.countries.nodes;
        }
      );
      this.locationServiceService.getCountry().subscribe({
        next: (data) => {
          this.currentCountry = this.countries.find((option: any) => { return option.code == data.countryCode; });
          this.country.setValue(this.currentCountry.name);
        },
        error: (error) => {
          console.log("Error in geting location: ", error);
        }
      });
    }

  ngOnInit() {
    // this.filteredCountries = this.country.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterCountries(value)),
    // );
    this.filteredCountries = this.country.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filterCountries(name) : this.countries.slice())),
    );

    this.filteredSchools = this.school.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this.checkSchools(name) : this.schools.slice())),
    );
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

  private _filterCountries(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter((option: any) => option.name.toLowerCase().includes(filterValue));
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

  onSubmit(): void {
    this.form.country = this.countries.find((option: any) => { return option.name == this.country.value; });
    
    const { firstname, lastname, role, country, username, email, password, school} = this.form;
    // console.log(this.form);
    // return;
    this.authService
      .register(firstname, lastname, role,  username, email, password, country.code, school)
      .subscribe({
        next: (data) => {
          // console.log(data);
          this.userEmail = email;
          this.isSignUpFailed = false;
          this.isSuccessful = true;
          this.errorMessage = '';
          this.sendEmailVerificationCode();
        },
        error: (err) => {
          this.errorMessage = err;
          this.isSignUpFailed = true;
        },
      });
  }

  firstFormSubmit() {
    this.formStep = 2;
  }

  moveToPreviousStep(step: number){
    this.formStep = step;
  }
  
  secondFormSubmit() {
    if(this.form.role == "TEACHER" || this.form.role == "SCHOOL_ADMIN"){
      this.formStep = 3;
    }
    else{
      this.onSubmit();
    }
  }

  sendEmailVerificationCode(){
    // console.log("Username: ", this.form.username);
    this.authService.sendEmailVerificationCode(this.form.username).subscribe({
      next: (data) => {
      },
      error: (error) => {
        // console.log("Error in sending verification code: ", error.message);
        this.errorMessage = error.message;
      }
    });
  }

  setCity(school: any){
    this.form.school = {
      city: school.city,
      name: school.name,
      schoolId: school.id
    };
    this.form.city = school.city;
  }

}
