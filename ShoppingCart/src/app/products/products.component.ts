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
  totalPage;
  products = [];
  isShowingSpinner = true;
  totalProducts = [];
  constructor(private router: Router,
  private service: ProductService) {}
  searchFilter = null;
  ngOnInit() {
    const self = this;
    // self.service.getListProducts().subscribe((result: any) => {
    //   self.isShowingSpinner = false;
    //   self.totalProducts = result;
    //   self.totalPage = self.totalProducts.length % MAX_PRODUCTS_PER_PAGE === 0 ?
    //   Math.floor(self.totalProducts.length / MAX_PRODUCTS_PER_PAGE) :
    //   Math.floor(self.totalProducts.length / MAX_PRODUCTS_PER_PAGE) + 1;
    //   self.goToPage(1);
    // });
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
      self.totalPage = result.totalPage;
      self.products = result.data.listProducts;
    });
  }

  // Chờ có backend
  goToPage(page) {
    const self = this;
    self.isShowingSpinner = true;
    page > self.totalPage
      ? (self.currentPage = self.totalPage)
      : page < 1 ? (self.currentPage = 1) : (self.currentPage = page);

      self.service.getSearchFilter(page, MAX_PRODUCTS_PER_PAGE,
        self.searchFilter.productName,
        self.searchFilter.priceOption,
        self.searchFilter.typeId,
        self.searchFilter.brandId
      ).subscribe((result: any) => {
        self.isShowingSpinner = false;
        self.products = result.data.listProducts;
      });
  }

  // // Xài tạm tới khi có backend
  // goToPage(page) {
  //   const self = this;
  //   page > self.totalPage
  //     ? (self.currentPage = self.totalPage)
  //     : page < 1 ? (self.currentPage = 1) : (self.currentPage = page);
  //   if (self.currentPage === self.totalPage) {
  //     const min = Math.floor(self.totalProducts.length / MAX_PRODUCTS_PER_PAGE) * MAX_PRODUCTS_PER_PAGE;
  //     self.totalProducts.length % MAX_PRODUCTS_PER_PAGE === 0
  //       ? self.setListProducts(
  //           self.totalProducts.length - MAX_PRODUCTS_PER_PAGE,
  //           self.totalProducts.length
  //         )
  //       : self.setListProducts(min, self.totalProducts.length);
  //   } else {
  //     const min = (self.currentPage - 1) * MAX_PRODUCTS_PER_PAGE;
  //     self.setListProducts(min, min + 8);
  //   }
  // }
  // setListProducts(start, end) {
  //   const self = this;
  //   self.products = [];
  //   for (let i = start; i < end; i++) {
  //     if (i + 1 <= self.totalProducts.length) {
  //       self.products.push(self.totalProducts[i]);
  //     } else {
  //       break;
  //     }
  //   }
  // }

  filter(value) {
    const self = this;
    self.isShowingSpinner = true;
    self.searchFilter = value;
    self.service.getSearchFilter(1, MAX_PRODUCTS_PER_PAGE, value.productName, value.priceOption, value.typeId, value.brandId,)
    .subscribe((result: any) => {
    self.isShowingSpinner = false;
    self.totalPage = result.totalPage;
    self.products = result.data.listProducts;
    });
  }
}
