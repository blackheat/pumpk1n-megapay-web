import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AccountService } from './account.service';
import {
  MAX_ORDERS_PER_PAGE, API_CHECKOUT, API_ORDER,
} from '../shared/constants';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: '*/*' });

  constructor(private httpClient: HttpClient, private accountService: AccountService, private datePipe: DatePipe) { }

  getListOrders(page) {
    const self = this;
    return self.httpClient.get(`${API_ORDER}/all?page=${page}&count=${MAX_ORDERS_PER_PAGE}`);
  }

  getOrdersHistory(page) {
    const self = this;
    return self.httpClient.get(`${API_ORDER}?page=${page}&count=${99999}`);
  }

  checkout(value) {
    const self = this;
    return self.httpClient.post(API_CHECKOUT, value, { headers: self.headers });
  }

  confirm(id) {
    const self = this;
    return self.httpClient.put(`${API_ORDER}/${id}/confirmation`, null, { headers: self.headers });
  }

  cancel(id) {
    const self = this;
    return self.httpClient.put(`${API_ORDER}/${id}/cancellation`, null, { headers: self.headers });
  }
}
