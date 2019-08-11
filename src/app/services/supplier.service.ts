import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    API_SUPPLIER
} from '../shared/constants';
@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    searchByNavbar = '';
    searchNavBarEvent: EventEmitter<any> = new EventEmitter();
    cartChange: EventEmitter<any> = new EventEmitter();
    constructor(private httpClient: HttpClient) { }

    headers = new HttpHeaders({ 'Content-Type': 'application/json', Accept: '*/*' });

    getSupplierById(id: number) {
        return this.httpClient.get(`${API_SUPPLIER}/${id}`);
    }

    getSearchFilter(
        page: number,
        productsPerPage: number,
        supplierName?: string
    ) {
        let queryParam = `${API_SUPPLIER}?page=${page}&count=${productsPerPage}`;

        supplierName && supplierName !== '' ? (queryParam = `${queryParam}&name=${supplierName}`) : null;

        return this.httpClient.get(queryParam);
    }

    modifySupplier(value) {
        const self = this;
        const body = {
            name: value.name,
            longDescription: value.description,
            shortDescription: value.shortDescription,
            price: value.price,
            image: value.image,
            deprecated: value.deprecated
        }

        return self.httpClient.patch(`${API_SUPPLIER}/${value.id}`, body, { headers: self.headers });
    }
    addSupplier(value) {
        const self = this;
        const body = {
            name: value.name,
            longDescription: value.description,
            shortDescription: value.shortDescription,
            price: value.price,
            image: value.image,
            deprecated: false
        }

        return self.httpClient.post(`${API_SUPPLIER}`, body, { headers: self.headers });
    }
}
