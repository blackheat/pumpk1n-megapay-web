import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../shared/constants';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [ './products.component.css' ]
})
export class ProductsComponent implements OnInit {
  currentPage = 1;
  totalPage;
  products = [];
  totalProducts = [
    {
      image: 'assets/pictures/img/DE01.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 1',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/DE02.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 2',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/DE03.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 3',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/DE04.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 4',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/DE05.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 5',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/DE06.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 6',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/DE07.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 7',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/DE08.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 8',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/DE09.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 9',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/DE10.jpg',
      name: 'Laptop name',
      description: 'Laptop DELL 10',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/AS01.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/AS02.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/AS03.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/AS04.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/AS05.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/AS06.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/AS07.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/AS08.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/AS09.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/AS10.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/HP01.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/HP02.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/HP03.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/HP04.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/HP05.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/HP06.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/HP07.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/HP08.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/HP09.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/HP10.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/LE01.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/LE02.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/LE03.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/LE04.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/LE05.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/LE06.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/LE07.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/LE08.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
    {
      image: 'assets/pictures/img/LE09.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/LE10.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
  ];
  constructor(private router: Router) {}

  ngOnInit() {
    const self = this;
    self.totalPage = self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE + 1;
    self.goToFirstPage();
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
      const min = self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE * Constants.MAX_PRODUCTS_PER_PAGE;
      self.totalProducts.length % Constants.MAX_PRODUCTS_PER_PAGE === 0 ?
      self.setListProducts(self.totalProducts.length - Constants.MAX_PRODUCTS_PER_PAGE, self.totalProducts.length) :
      self.setListProducts(min + 1, self.totalProducts.length);
    } else {
      const min = (self.currentPage - 1) * Constants.MAX_PRODUCTS_PER_PAGE;
      self.setListProducts(min, min + 8);
    }
  }

  goToLastPage() {
    const self = this;
    const min = self.totalProducts.length / Constants.MAX_PRODUCTS_PER_PAGE * Constants.MAX_PRODUCTS_PER_PAGE;
    self.currentPage = self.totalPage;
    self.totalProducts.length % Constants.MAX_PRODUCTS_PER_PAGE === 0 ?
    self.setListProducts(self.totalProducts.length - Constants.MAX_PRODUCTS_PER_PAGE, self.totalProducts.length) :
    self.setListProducts(min + 1, self.totalProducts.length);
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
