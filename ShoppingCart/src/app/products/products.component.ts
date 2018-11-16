import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../shared/constants';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit {
  currentPage = 1;
  totalPage;
  products = [];
  isShowingSpinner = true;
  totalProducts = [];
  constructor(private router: Router, private service: ProductService) {}

  ngOnInit() {
    const self = this;
    self.service.getListProducts().subscribe((result: any) => {
      self.isShowingSpinner = false;
      self.totalProducts = result;
      self.totalPage = self.totalProducts.length % Constants.MAX_PRODUCTS_PER_PAGE === 0 ?
      Math.floor(self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE) :
      Math.floor(self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE) + 1;
      self.goToFirstPage();
    });
  }

  goToFirstPage() {
    const self = this;
    self.currentPage = 1;
    self.setListProducts(0, Constants.MAX_PRODUCTS_PER_PAGE);
  }

  goToPage(page) {
    const self = this;
    page > self.totalPage
      ? (self.currentPage = self.totalPage)
      : page < 1 ? (self.currentPage = 1) : (self.currentPage = page);
    if (self.currentPage === self.totalPage) {
      const min = Math.floor(self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE) * Constants.MAX_PRODUCTS_PER_PAGE;
      self.totalProducts.length % Constants.MAX_PRODUCTS_PER_PAGE === 0
        ? self.setListProducts(
            self.totalProducts.length - Constants.MAX_PRODUCTS_PER_PAGE,
            self.totalProducts.length
          )
        : self.setListProducts(min, self.totalProducts.length);
    } else {
      const min = (self.currentPage - 1) * Constants.MAX_PRODUCTS_PER_PAGE;
      self.setListProducts(min, min + 8);
    }
  }

  goToLastPage() {
    const self = this;
    const min = Math.floor(self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE) * Constants.MAX_PRODUCTS_PER_PAGE;
    self.currentPage = self.totalPage;
    self.totalProducts.length % Constants.MAX_PRODUCTS_PER_PAGE === 0
      ? self.setListProducts(
          self.totalProducts.length - Constants.MAX_PRODUCTS_PER_PAGE,
          self.totalProducts.length
        )
      : self.setListProducts(min, self.totalProducts.length);
  }

  setListProducts(start, end) {
    const self = this;
    self.products = [];
    for (let i = start; i < end; i++) {
      if (i + 1 <= self.totalProducts.length) {
        self.products.push(self.totalProducts[i]);
      } else {
        break;
      }
    }
  }
}
