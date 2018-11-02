import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  currentPage = 1;
  totalPage;
  totalImages = [
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
    'assets/pictures/img/DE01.jpg',
    'assets/pictures/img/DE02.jpg',
    'assets/pictures/img/DE03.jpg',
    'assets/pictures/img/DE04.jpg',
  ];
  images = [];
  constructor(private router: Router) { }

  ngOnInit() {
    const self = this;
    self.totalPage = self.totalImages.length / 8 + 1;
    self.goToFirstPage();
  }

  goToFirstPage() {
    const self = this;
    self.currentPage = 1;
    self.setListImages(0, 8);
  }

  goToPage(page) {
    const self = this;
    page > self.totalPage ? self.currentPage = self.totalPage :
    page < 1 ? self.currentPage = 1 : self.currentPage = page;

    self.setListImages(self.currentPage - 1, self.currentPage + 7);
  }

  goToLastPage() {
    const self = this;
    self.currentPage = self.totalPage;
    self.setListImages(self.totalPage - self.totalPage % 8 - 1, self.totalPage);
  }

  setListImages(start, end) {
    const self = this;
    self.images = [];
    for (let i = start; i < end; i++) {
      if (i + 1 <= self.totalImages.length) {
        self.images.push(self.totalImages[i]);
      } else {
        break;
      }
    }
  }

}
