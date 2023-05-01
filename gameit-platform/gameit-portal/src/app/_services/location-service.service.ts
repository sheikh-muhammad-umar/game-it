import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {

  public lat: any;
  public lon: any;
  geoAPI = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

  constructor(private http: HttpClient) { }

  getCountry(): Observable<any> {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    return this.http.get(this.geoAPI + `?latitude=${this.lat}&longitude=${this.lon}`);
  }
}
