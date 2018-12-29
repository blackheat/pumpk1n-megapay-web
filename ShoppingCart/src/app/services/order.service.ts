import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AccountService } from './account.service';
import { API_GET_EMPLOYEE_ORDERS, MAX_ORDERS_PER_PAGE, API_MODIFY_EMPLOYEE_ORDERS } from '../shared/constants';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' });

  constructor(private httpClient: HttpClient, private accountService: AccountService) {}

  getListOrders(page) {
    const self = this;
    return self.httpClient.get(
      `${API_GET_EMPLOYEE_ORDERS}?page=${page}&ordersPerPage=${MAX_ORDERS_PER_PAGE}&token=${self.accountService.getAccessToken()}`
    );
  }

  modifyOrder(value) {
    const self = this;
    const body = new HttpParams()
    .set('orderId', value.id)
    .set('orderStatus', value.state)
    .set('token', self.accountService.getAccessToken());

    return self.httpClient
      .post(API_MODIFY_EMPLOYEE_ORDERS, body.toString(), { headers: self.headers });
  }
}
