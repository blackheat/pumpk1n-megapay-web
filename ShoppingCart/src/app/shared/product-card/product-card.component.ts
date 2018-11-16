import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() image: string;

  product = {
    name: 'Laptop name',
    description: 'Laptop description',
    price: 10000000
  }

  getProduct() {
    this.service.getProduct.subscribe(data => {
      this.product = data;
    })
  }

  constructor(private service: ProductService) {
    
  }

  ngOnInit() {
  }

}
