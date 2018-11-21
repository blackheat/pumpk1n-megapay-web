import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { throwError } from '../../../node_modules/rxjs';
import * as jwt_decode from 'jwt-decode';
import { API_REGISTER } from '../shared/constants';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private loggedInStatus = false;

  constructor(private httpClient: HttpClient) {
    if (localStorage.getItem('currentUser')) {
      this.setLoggedIn(true);
    }
  }

  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  listener: EventEmitter<any> = new EventEmitter<any>();

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  isLoggedIn() {
    return this.loggedInStatus;
  }

  // Login(account) {
  //   return this.httpClient
  //     .post(
  //       `http://localhost:51930/login`,
  //       { Id: account.id, Password: account.password },
  //       { headers: this.headers }
  //     )
  //     .pipe(
  //       map((user: any) => {
  //         // login successful if there's a jwt token in the response
  //         if (user && user.accessToken) {
  //           // store user details and jwt token in local storage to keep user logged in between page refreshes
  //           localStorage.setItem('currentUser', JSON.stringify(user));
  //           this.setLoggedIn(true);
  //           this.listener.emit(this.getDecodedAccessToken(user.accessToken));
  //           return user;
  //         } else {
  //           throwError({error: {message: 'Username or password is incorrect'}});
  //         }
  //       })
  //     );
  // }



  logout() {
    // remove user from local storage to log user out
    this.setLoggedIn(false);
    localStorage.removeItem('currentUser');
  }

  register(value) {
    const self = this;
    return self.httpClient
    .post(API_REGISTER, value);
  }

  getDecodedAccessToken(token: string): any {
    try {
        return jwt_decode(token);
    } catch (Error) {
        return null;
    }
  }

  // updateScoreByStudentId(id: string , obj: any) {
  //   console.log(obj);
  //   return this.httpClient
  //   .put(`http://localhost:51930/api/score/` + id, obj, {
  //     headers: this.headers
  //   });
  // }
}
