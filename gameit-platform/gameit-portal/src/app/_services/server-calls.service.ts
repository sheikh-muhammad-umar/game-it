import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookiesStorageService } from './cookies-storage.service';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ServerCallsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.cookiesStorageService.getCookie(
        'authToken'
      )}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookiesStorageService: CookiesStorageService,
    private apollo: Apollo
  ) {}

  getStats(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/api/dashboard/stats`,
      { dateRange },
      this.httpOptions
    );
  }

  totalUsersByGoogle(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/google/totalusers`,
      { dateRange },
      this.httpOptions
    );
  }

  newUsersByGoogle(dateRange: any) {
    return this.http.post(
      `${environment.AUTH_API2}/google/newusers`,
      { dateRange },
      this.httpOptions
    );
  }

  getCountries() {
    const GET_COUNTRIES = gql`
      query Countries {
        countries {
          totalCount
          nodes {
            code
            name
          }
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_COUNTRIES,
    });
  }

  // getUser() {
  //   return this.http.post(
  //     `${environment.AUTH_API2}/api/user/info`,{},
  //     this.httpOptions
  //   );
  // }

  getUser() {
    const GET_USER_INFO = gql`
    query Me {
      me {
        id
        email
        firstName
        lastName
        username
      }
    }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_USER_INFO,
      fetchPolicy: 'network-only'
    });
  }
  
  getSchools(subString: string) {  
    const GET_SCHOOLS = gql`
    query ListSchools($sortOrder: [SchoolsSortOrder], $filters: SchoolListFilters) {
      listSchools(sortOrder: $sortOrder, filters: $filters) {
        totalCount
        nodes {
          city
          country {
            code
            name
          }
          id
          name
        }
      }
    }  
    `;

    return this.apollo.watchQuery<any>({
      query: GET_SCHOOLS,
      variables: {
        sortOrder: "NAME_ASC",
        filters: {
          name: subString
        },
      }
    });
  }

  changePassword(current: string, newPassword: string) {
    const LOGOUT_POST = gql`
      mutation ChangeAcconntPassword($inputs: ChangePasswordInputs!) {
        changePassword(inputs: $inputs)
      }
    `;

    return this.apollo.mutate({
      mutation: LOGOUT_POST,
      variables: {
        inputs: {
          current,
          newPassword,
        },
      },
    });
  }
}
