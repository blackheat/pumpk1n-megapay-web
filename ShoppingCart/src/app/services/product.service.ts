import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { API_PRODUCT, API_TYPE, API_BRAND, API_NEWEST_PRODUCTS } from '../shared/constants';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getListProducts() { // xài tạm tới khi có backend
  return this.httpClient
  .get(API_PRODUCT);
  }

  getProductById(id: number) {
    return this.httpClient
    .get(`${API_PRODUCT}/${id}`);
  }

  getSearchFilter(productName?: string, priceOption?: number, typeId?: number, brandId?: number, page?: number, productPerPage?: number) {
    return this.httpClient
    .get(`${API_PRODUCT}?
    productName=${productName}&
    priceOption=${priceOption}&
    typeId=${typeId}&
    brandId=${brandId}&
    page=${page}&
    productPerPage=${productPerPage}`);
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
