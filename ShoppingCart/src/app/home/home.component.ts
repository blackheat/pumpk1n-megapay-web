import { Component, OnInit, EventEmitter } from '@angular/core';
import { AccountService } from '../services/account.service';

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
  products = [
    {
      image: 'assets/pictures/img/DE01.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 12000000
    },
    {
      image: 'assets/pictures/img/DE02.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 10000000
    },
    {
      image: 'assets/pictures/img/DE03.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 23000000
    },
    {
      image: 'assets/pictures/img/DE04.jpg',
      name: 'Laptop name',
      description: 'Laptop description',
      price: 14000000
    },
  ];
  options: any;
  ngOnInit() {
    this.options = {
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
    // this.userRole = this.service.getDecodedAccessToken(JSON.parse(localStorage.getItem('currentUser')).accessToken).role;
  }
}
