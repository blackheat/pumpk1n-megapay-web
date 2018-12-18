import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.css' ]
})
export class CartComponent implements OnInit {
  cart;
  constructor(private service: ProductService, private router: Router) {}

  ngOnInit() {
    const self = this;
    self.cart = self.service.getCart();
  }

  deleteCart(id) {
    const self = this;
    self.service.deleteCart(id);

    const index = self.cart.listProducts
      .map(function(e) {
        return e.id;
      })
      .indexOf(id);
    self.cart.listProducts.splice(index, 1);
  }

  navigate(id) {
    const self = this;
    self.router.navigate([ '/products/', id ]);
  }

  minQuantity(id, quantity) {
    const self = this;

    if (quantity <= 1) {
      return;
    }

    self.service.editCart(id, quantity - 1);
    self.cart = self.service.getCart();
  }

  addQuantity(id, quantity, leftItems) {
    const self = this;

    if (quantity > leftItems) {
      return;
    }

    self.service.editCart(id, quantity + 1);
    self.cart = self.service.getCart();
  }
}
