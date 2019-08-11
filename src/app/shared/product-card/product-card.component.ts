import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product;

  constructor(private router: Router, private accountService: AccountService, private service: ProductService) {
  }

  ngOnInit() {
    
  }

  productInfo(id: number) {
    const self = this;
    self.router.navigate(['/products/', id]);
  }

  addToCart(id) {

    const self = this;
    if (!self.accountService.getAccessToken()) {
      self.router.navigate(['/login']);
    } else {
      self.service.getProductById(id).subscribe((value: any) => {
        self.service.addCart(value.data, 1);
        swal({
          title: 'Congratulations!',
          text: 'Add product to cart successfully.',
          icon: 'success'
        });
      });
    }
  }
}
