import { Component, OnInit, Input } from '@angular/core';
import { IMAGE_PATH } from '../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product;
  image: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const self = this;
    self.image = `${IMAGE_PATH}/${self.product.id}.jpg`;
  }

  productInfo(id: number) {
    const self = this;
    self.router.navigate(['/products/', id]);
  }
}
