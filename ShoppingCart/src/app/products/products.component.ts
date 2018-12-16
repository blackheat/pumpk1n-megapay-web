import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { MAX_PRODUCTS_PER_PAGE, DEFAULT_ID } from '../shared/constants';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit {
  currentPage = 1;
  totalPage = 0;
  products = [];
  isShowingSpinner = true;
  totalProducts = [];
  constructor(private router: Router, private service: ProductService) {}
  searchFilter = null;
  ngOnInit() {
    const self = this;
    // self.service.searchByNavbar.subscribe((value) => {
    //   if (value !== null) {
    //     self.service.getSearchFilter(1, MAX_PRODUCTS_PER_PAGE, value).subscribe((result: any) => {
    //       self.isShowingSpinner = false;
    //       self.totalPage = result.totalPage;
    //       self.products = result.data.listProducts;
    //     });
    //   }
    // });
    self.service.getSearchFilter(1, MAX_PRODUCTS_PER_PAGE).subscribe((result: any) => {
      self.isShowingSpinner = false;
      if (result.returnMessage === 'SUCCESS') {
        self.totalPage = result.data.numberOfPage;
        self.products = result.data.listProducts;
      }
    });
  }

  goToPage(page) {
    const self = this;
    self.isShowingSpinner = true;
    page > self.totalPage
      ? (self.currentPage = self.totalPage)
      : page < 1 ? (self.currentPage = 1) : (self.currentPage = page);

    self.service
      .getSearchFilter(
        self.currentPage,
        MAX_PRODUCTS_PER_PAGE,
        self.searchFilter ? self.searchFilter.productName : null,
        self.searchFilter ? self.searchFilter.priceOption : null,
        self.searchFilter ? self.searchFilter.typeId : 0,
        self.searchFilter ? self.searchFilter.brandId : 0
      )
      .subscribe((result: any) => {
        self.isShowingSpinner = false;
        self.totalPage = result.data.numberOfPage;
        self.products = result.data.listProducts;
      });
  }

  filter(value) {
    const self = this;
    self.currentPage = 1;
    self.isShowingSpinner = true;
    self.searchFilter = value;
    self.service
      .getSearchFilter(1, MAX_PRODUCTS_PER_PAGE, value.productName, value.priceOption, value.typeId, value.brandId)
      .subscribe((result: any) => {
        self.isShowingSpinner = false;
        self.totalPage = result.data.numberOfPage;
        self.products = result.data.listProducts;
      });
  }
}
