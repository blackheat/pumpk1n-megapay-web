import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { throwError } from '../../../node_modules/rxjs';
import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private loggedInStatus = false;

  constructor(private httpClient: HttpClient) {
  }
}
