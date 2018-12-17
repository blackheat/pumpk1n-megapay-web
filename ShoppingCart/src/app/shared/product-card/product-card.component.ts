import { Component, OnInit, Input } from '@angular/core';
import { IMAGE_PATH } from '../constants';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product;
  image: string;

  constructor(private router: Router, private service: ProductService) {
  }

  ngOnInit() {
    const self = this;
    self.image = `${IMAGE_PATH}/${self.product.id}.jpg`;
  }

  productInfo(id: number) {
    const self = this;
    self.router.navigate(['/products/', id]);
  }

  addToCart(id) {
    const self = this;
    self.service.getProductById(id).subscribe((value: any) => {
      self.service.addCart(value.data.product, 1);
    });
  }
}
