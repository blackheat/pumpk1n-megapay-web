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

  searchByNavbar = '';
  searchNavBarEvent: EventEmitter<any> = new EventEmitter();
  cartChange: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient) { }


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

  getCart() {
    if (localStorage.getItem('cart')) {
      return JSON.parse(localStorage.getItem('cart'));
    }
    return null;
  }

  addCart(product, quantity) {
    const self = this;
    if (localStorage.getItem('cart')) {
      const currentCart = self.getCart();
      if (currentCart.listProducts.map(function(e) { return e.product.id; }).includes(product.id)) {
        const index = currentCart.listProducts.map(function(e) { return e.product.id; }).indexOf(product.id);
        currentCart.listProducts[index].quantity += quantity;
        currentCart.total += quantity;
      } else {
        currentCart.listProducts.push({
          product: product,
          quantity: quantity
        });
        currentCart.total += quantity;
      }
      localStorage.setItem('cart', JSON.stringify(currentCart));
      self.cartChange.emit();
    }
  }

  editCart(id, quantity) {
    const self = this;
    if (localStorage.getItem('cart')) {
      const currentCart = self.getCart();
      if (currentCart.listProducts.map(function(e) { return e.product.id; }).includes(id)) {
        const index = currentCart.listProducts.map(function(e) { return e.product.id; }).indexOf(id);
        const num = quantity - currentCart.listProducts[index].quantity;
        currentCart.listProducts[index].quantity = quantity;
        currentCart.total += num;
      } else {
        return;
      }
      localStorage.setItem('cart', JSON.stringify(currentCart));
      self.cartChange.emit();
    }
  }

  deleteCart(id) {
    const self = this;
    if (localStorage.getItem('cart')) {
      const currentCart = self.getCart();
      if (currentCart.listProducts.map(function(e) { return e.product.id; }).includes(id)) {
        const index = currentCart.listProducts.map(function(e) { return e.product.id; }).indexOf(id);
        currentCart.total -= currentCart.listProducts[index].quantity;
        currentCart.listProducts.splice(index, 1);
      } else {
        return;
      }
      localStorage.setItem('cart', JSON.stringify(currentCart));
      self.cartChange.emit();
    }
  }

}
