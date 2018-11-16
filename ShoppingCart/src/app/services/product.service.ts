import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { Constants } from '../shared/constants';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getListProducts() {
  return this.httpClient
  .get(Constants.API_PRODUCT);
  }

  getProductById(id: number) {
    return this.httpClient
    .get(`${Constants.API_PRODUCT}?id=${id}`);
  }

  getSearchFilter(name: string, price: number, type: number, model: string) {
    return this.httpClient
    .get(`${Constants.API_PRODUCT}?name=${name}&price=${price}&type=${type}&model=${model}`);
  }

}
