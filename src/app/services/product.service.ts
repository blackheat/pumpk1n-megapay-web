import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  API_PRODUCT,
  MAX_ORDERS_PER_PAGE,
  API_MODIFY_PRODUCT
} from '../shared/constants';
import { AccountService } from './account.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  searchByNavbar = '';
  searchNavBarEvent: EventEmitter<any> = new EventEmitter();
  cartChange: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient, private accountService: AccountService) { }

  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' });

  getProductById(id: number) {
    return this.httpClient.get(`${API_PRODUCT}/${id}`);
  }

  getSearchFilter(
    page: number,
    productsPerPage: number,
    productName?: string,
    // priceOption?: string,
    // typeId?: number,
    // brandId?: number
  ) {
    let queryParam = `${API_PRODUCT}?page=${page}&count=${productsPerPage}`;

    productName && productName !== '' ? (queryParam = `${queryParam}&name=${productName}`) : null;
    // priceOption && priceOption !== '' ? (queryParam = `${queryParam}&priceOption=${priceOption}`) : null;
    // typeId && typeId !== 0 && typeId.toString() !== '0' ? (queryParam = `${queryParam}&typeId=${typeId}`) : null;
    // brandId && brandId !== 0 && brandId.toString() !== '0' ? (queryParam = `${queryParam}&brandId=${brandId}`) : null;

    return this.httpClient.get(queryParam);
  }

  getNewestProducts() {
    return this.httpClient.get(`${API_PRODUCT}?page=1&count=5`);
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
      if (
        currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .includes(product.id)
      ) {
        const index = currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .indexOf(product.id);
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
      if (
        currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .includes(id)
      ) {
        const index = currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .indexOf(id);
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
      if (
        currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .includes(id)
      ) {
        const index = currentCart.listProducts
          .map(function (e) {
            return e.product.id;
          })
          .indexOf(id);
        currentCart.total -= currentCart.listProducts[index].quantity;
        currentCart.listProducts.splice(index, 1);
      } else {
        return;
      }
      localStorage.setItem('cart', JSON.stringify(currentCart));
      self.cartChange.emit();
    }
  }

  emptyCart() {
    const self = this;
    const currentCart = self.getCart();
    localStorage.setItem('cart', JSON.stringify({ listProducts: [], total: 0 }));
    self.cartChange.emit();
  }

  checkout(value) {
    const self = this;
    const body = new HttpParams().set('items', value.items).set('token', value.token);

    // return self.httpClient.post(API_ADD_USER_ORDERS, body.toString(), { headers: self.headers });
  }

  converJsonToMultipleLinesString(value) {
    let returnValue = '';
    value.forEach(element => {
      returnValue += `${element.title}: ${element.value}\n`;
    });
    return returnValue.slice(0, -1);
  }

  convertSpecs(specs) {
    specs = specs
      .replace(/\\n/g, '\\n')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f');
    // remove non-printable and other non-valid JSON chars
    specs = specs.replace(/[\u0000-\u0019]+/g, '');
    const specsList = JSON.parse(`{${specs}}`);
    const specsReturn = [];
    Object.keys(specsList).forEach(function (key) {
      specsReturn.push({ title: `"${key.toLocaleUpperCase()}"`, value: `"${specsList[key]}"` });
    });
    return specsReturn;
  }
  // getOrdersHistory(page) {
  //   const self = this;
  //   return self.httpClient.get(
  //     `${API_GET_USER_ORDERS}?page=${page}&ordersPerPage=${MAX_ORDERS_PER_PAGE}&token=${self.accountService.getAccessToken()}`
  //   );
  // }
  modifyProduct(value) {
    const self = this;
    const body = new HttpParams()
      .set('productId', value.id)
      .set('brandId', value.brand)
      .set('typeId', value.type)
      .set('name', value.name)
      .set('description', value.description)
      .set('price', value.price)
      .set('leftItems', value.quantity)
      .set('specs', value.specs)
      .set('isDeleted', value.isDeleted ? '1' : '0')
      .set('token', self.accountService.getAccessToken());

    return self.httpClient.post(API_MODIFY_PRODUCT, body.toString(), { headers: self.headers });
  }
}
