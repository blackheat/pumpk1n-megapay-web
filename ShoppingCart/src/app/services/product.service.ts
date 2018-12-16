import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { API_PRODUCT, API_TYPE, API_BRAND, API_NEWEST_PRODUCTS } from '../shared/constants';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  searchByNavbar: EventEmitter<string> = new EventEmitter<string>();

  constructor(private httpClient: HttpClient) { }

  // getListProducts() { // xài tạm tới khi có backend
  // return this.httpClient
  // .get(API_PRODUCT);
  // }

  getProductById(id: number) {
    return this.httpClient
    .get(`${API_PRODUCT}/${id}`);
  }

  getSearchFilter(page: number, productsPerPage: number, productName?: string, priceOption?: string, typeId?: number, brandId?: number) {

    let queryParam = `${API_PRODUCT}?page=${page}&productsPerPage=${productsPerPage}`;

    productName && productName !== '' ? queryParam = `${queryParam}&productName=${productName}` : null;
    priceOption && priceOption !== '' ? queryParam = `${queryParam}&priceOption=${priceOption}` : null;
    typeId && typeId !== 0 ? queryParam = `${queryParam}&typeId=${typeId}` : null;
    brandId && brandId !== 0 ? queryParam = `${queryParam}&brandId=${brandId}` : null;

    return this.httpClient
    .get(queryParam);
  }

  getListType() {
    return this.httpClient
    .get(API_TYPE);
  }

  getListBrand() {
    return this.httpClient
    .get(API_BRAND);
  }

  getNewestProducts() {
    return this.httpClient
    .get(API_NEWEST_PRODUCTS);
  }
}
