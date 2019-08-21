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

  getListOrders(page, filter) {
    const self = this;
    const orderId = filter.orderId ? filter.orderId : null;
    const dateFrom = filter.dateFrom ? filter.dateFrom : '01/01/1980';
    const dateTo = filter.dateTo ? filter.dateTo : self.datePipe.transform(new Date(), 'MM/dd/yyyy');

    let apiString =
      `${'a'}?page=${page}&ordersPerPage=${MAX_ORDERS_PER_PAGE}` +
      `&token=${self.accountService.getAccessToken()}`;

    if (orderId) {
      apiString += `&orderId=${orderId}`;
    }
    if (dateFrom) {
      apiString += `&from=${dateFrom}`;
    }
    if (dateTo) {
      apiString += `&to=${dateTo}`;
    }
    return self.httpClient.get(apiString);
  }

  modifyOrder(value) {
    const self = this;
    const body = new HttpParams()
      .set('orderId', value.id)
      .set('orderStatus', value.state)
      .set('token', self.accountService.getAccessToken());

    return self.httpClient.post('a', body.toString(), { headers: self.headers });
  }
  getOrdersHistory(page) {
    const self = this;
    return self.httpClient.get(`${API_ORDER}?page=${page}&count=${99999}`);
  }

  checkout(value) {
    const self = this;
    return self.httpClient.post(API_CHECKOUT, value, { headers: self.headers });
  }
}
