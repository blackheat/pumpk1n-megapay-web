import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_GET_USER_INFO, convertDate } from '../shared/constants';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private accountService: AccountService) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' });

  getUserInfo() {
    const self = this;
    return self.httpClient.get(`${API_GET_USER_INFO}`);
  }

  // modifyUserInfo(value) {
  //   const self = this;
  //   const body = new HttpParams()
  //     .set('name', value.name)
  //     .set('email', value.email)
  //     .set('birthday', convertDate(value.birthday, 'yyyyMMdd').toString())
  //     .set('phone', value.phone)
  //     .set('address', value.address)
  //     .set('token', value.token);

  //   return self.httpClient
  //     .post(API_MODIFY_USER_INFO, body.toString(), { headers: self.headers });
  // }

}
