import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BALANCE_SERVICE, API_TOKEN_PURCHASE_REQUEST, MAX_PRODUCTS_ROW_PER_PAGE } from '../shared/constants';
@Injectable({
    providedIn: 'root'
})
export class BalanceService {
    constructor(private httpClient: HttpClient) { }
    updateBalanceEmitter = new EventEmitter;
    headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: '*/*' });

    getBalanceToken() {
        const self = this;
        return self.httpClient.get(API_BALANCE_SERVICE);
    }

    topup(value) {
        const self = this;
        const body = {
           amount: value.amount,
           notes: value.notes
        };

        return self.httpClient.post(`${API_TOKEN_PURCHASE_REQUEST}`, body, { headers: self.headers });
    }

    getTopupById(id) {
        const self = this;
        return self.httpClient.get(`${API_TOKEN_PURCHASE_REQUEST}/${id}`)
    }

    getTopupRequests(page) {
        const self = this;
        return self.httpClient.get(`${API_TOKEN_PURCHASE_REQUEST}?count=${MAX_PRODUCTS_ROW_PER_PAGE}&page=${page}`)
    }

    payForTopup(id) {
        const self = this;

        return self.httpClient.put(`${API_BALANCE_SERVICE}/request/${id}/billing`, null, { headers: self.headers });
    }

    cancelTopup(id) {
        const self = this;

        return self.httpClient.delete(`${API_TOKEN_PURCHASE_REQUEST}/${id}`, { headers: self.headers });
    }
}
