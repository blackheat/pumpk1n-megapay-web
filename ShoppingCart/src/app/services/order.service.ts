import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AccountService } from './account.service';
import {
  API_GET_EMPLOYEE_ORDERS,
  MAX_ORDERS_PER_PAGE,
  API_MODIFY_EMPLOYEE_ORDERS,
  API_GET_ORDER_BY_RANGE
} from '../shared/constants';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' });

  constructor(private httpClient: HttpClient, private accountService: AccountService, private datePipe: DatePipe) {}

  getListOrders(page, filter) {
    const self = this;
    const orderId = filter.orderId ? filter.orderId : null;
    const dateFrom = filter.dateFrom ? filter.dateFrom : '01/01/1980';
    const dateTo = filter.dateTo ? filter.dateTo : self.datePipe.transform(new Date(), 'MM/dd/yyyy');

    let apiString =
      `${API_GET_EMPLOYEE_ORDERS}?page=${page}&ordersPerPage=${MAX_ORDERS_PER_PAGE}` +
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

    return self.httpClient.post(API_MODIFY_EMPLOYEE_ORDERS, body.toString(), { headers: self.headers });
  }

  getListOrdersByDateRange(page, filter, ORDERS_PER_PAGE?) {
    const self = this;
    page = page <= 0 ? 1 : page;
    const ordersPerPage = ORDERS_PER_PAGE && ORDERS_PER_PAGE > 0 ? ORDERS_PER_PAGE : MAX_ORDERS_PER_PAGE;
    return self.httpClient.get(
      `${API_GET_ORDER_BY_RANGE}?page=${page}&ordersPerPage=${ordersPerPage}` +
      `&from=${filter.dateFrom}&to=${filter.dateTo}&token=${self.accountService.getAccessToken()}`
    );
  }
}
