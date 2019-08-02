import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from '../../../node_modules/rxjs';
import * as jwt_decode from 'jwt-decode';
import { API_REGISTER, API_LOGIN, API_GET_ACCOUNT, MAX_ACCOUNTS_PER_PAGE, API_MODIFY_ACCOUNT_ROLE } from '../shared/constants';
import { decode } from 'punycode';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private loggedInStatus = false;

  headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

  listener: EventEmitter<any> = new EventEmitter<any>();

  constructor(private httpClient: HttpClient) {
    if (localStorage.getItem('currentUser')) {
      this.setLoggedIn(true);
    }
  }

  private handleError(error: HttpErrorResponse) {
    // if (error.error instanceof ErrorEvent) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.error('An error occurred:', error.error.message);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    // }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  isLoggedIn() {
    return this.loggedInStatus;
  }

  getName() {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).name;
    }
    return null;
  }

  setName(name) {
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      currentUser.name = name;
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      return true;
    }
    return false;
  }

  getUserRole() {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).permission;
    }
    return null;
  }

  login(account) {
    const self = this;
    return self.httpClient.post(API_LOGIN, {email: account.email, password: account.password}, { headers: self.headers }).pipe(
      map((result: any) => {
        // login successful if there's a jwt token in the response
        if (result.responseType === 'success') {
          const decoding = this.decodeJWT(result.data.token);
          const currentUser = {
            token: result.data.token,
            name: decoding.nameid,
            permission: decoding.role
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem('cart', JSON.stringify({ listProducts: [], total: 0 }));
          self.setLoggedIn(true);
          self.listener.emit(self.getAccessToken());
        }
        return result.responseType;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.setLoggedIn(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
  }

  register(value) {
    const self = this;
    const info = {
      fullName: value.fullName,
      email: value.email,
      password: value.password
    }
    return self.httpClient
      .post(API_REGISTER, info, { headers: self.headers })
      .pipe(catchError(self.handleError));
  }

  getAccessToken() {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).token;
    }
    return null;
  }

  getListAccounts(page, filter) {
    const self = this;
    let queryParam = `${API_GET_ACCOUNT}?page=${page}&accountsPerPage=${MAX_ACCOUNTS_PER_PAGE}`;

    if (filter.username.trim() !== '') {
      queryParam += `&username=${filter.username}`;
    }
    return self.httpClient.get(queryParam);
  }

  modifyAccountRole(value) {
    const self = this;
    const body = new HttpParams()
      .set('userId', value.userId)
      .set('role', value.role)
      .set('token', self.getAccessToken());

    return self.httpClient
      .post(API_MODIFY_ACCOUNT_ROLE, body.toString(), { headers: self.headers });
  }

  decodeJWT(jwt) {
    if (jwt) {
      return jwt_decode(jwt);
    } else {
      return null;
    }
  }
}
