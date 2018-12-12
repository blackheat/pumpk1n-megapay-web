import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMAGE_PATH } from 'src/app/shared/constants';
import { ProductService } from 'src/app/services/product.service';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent implements OnInit {
  quantityForm: FormGroup;
  disableMin = true;
  disableAdd;
  product;
  image: string;
  productId;
  isShowingSpinner = true;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService) {
  }

  ngOnInit() {
    const self = this;
    self.productId = self.route.snapshot.paramMap.get('id');
    self.productService.getProductById(self.productId).subscribe((value: any) => {
      self.isShowingSpinner = false;
      self.product = value;
      self.quantityForm.controls.quantity.setValidators(Validators.max(value.quantity));
    });
    self.quantityForm = new FormGroup({
      quantity: new FormControl(1, Validators.compose([Validators.min(1), Validators.required])),
    });

    self.quantityForm.valueChanges.subscribe(v => {
      self.disableMin = self.disableAdd = false;
      if (v.quantity <= 1) {
        self.disableMin = true;
      }
      if (v.quantity >= self.product.quantity) {
        self.disableAdd = true;
      }
    });

    self.image = `${IMAGE_PATH}/${self.productId}.jpg`;
  }

  minQuantity() {
    const self = this;
    if (self.quantityForm.controls.quantity.value > 1) {
      self.quantityForm.controls.quantity.setValue(self.quantityForm.controls.quantity.value - 1);
    }
  }

  addQuantity() {
    const self = this;
    if (self.quantityForm.controls.quantity.value < self.product.quantity) {
      self.quantityForm.controls.quantity.setValue(self.quantityForm.controls.quantity.value + 1);
    }
  }
}
