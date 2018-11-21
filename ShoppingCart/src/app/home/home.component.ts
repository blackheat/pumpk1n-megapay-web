import { Component, OnInit, EventEmitter } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
  // userRole;
  // listener: EventEmitter<any>;
  // constructor(private service:  AccountService) {
  //   this.listener = this.service.listener;
  //   this.listener.subscribe((result: any) => {
  //     this.userRole = result.role;
  //   });
  // }
  slides = [
    'assets/pictures/slideshow/slideshow1.jpg',
    'assets/pictures/slideshow/slideshow2.jpg',
    'assets/pictures/slideshow/slideshow3.jpg'
  ];
  products = [];
  constructor (private service: ProductService) {}
  isShowingSpinner = true;
  options: any;
  ngOnInit() {
    const self = this;
    self.options = {
      dots: false,
      responsive: {
        '0': { items: 1 },
        '400': { items: 2 },
        '550': { items: 3 },
        '670': { items: 4 }
      },
      autoplay: true,
      loop: true,
      autoplayTimeout: 3000,
      lazyLoad: true
    };
    self.service.getNewestProducts().subscribe((result: any) => {
      self.isShowingSpinner = false;
      result.forEach(product => {
        self.products.push(product);
      });
    });
    // this.userRole = this.service.getDecodedAccessToken(JSON.parse(localStorage.getItem('currentUser')).accessToken).role;
  }
}
