import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
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
  listBrands;
  listTypes;
  brand;
  type;
  specs;
  isShowingSpinner = true;
  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, private accountService: AccountService) { }

  ngOnInit() {
    const self = this;
    self.productId = self.route.snapshot.paramMap.get('id');
    self.productService.getProductById(self.productId).subscribe((value: any) => {
      self.product = value.data;
      self.isShowingSpinner = false;
      // self.quantityForm.controls.quantity.setValidators(Validators.max(value.data.product.leftItems));
      // self.getTypesAndBrands().subscribe((result: any) => {
      //   
      //   self.brand =
      //     result[0].data.listBrands[
      //       result[0].data.listBrands
      //         .map(function (e) {
      //           return e.id;
      //         })
      //         .indexOf(self.product.brandId)
      //     ].name;
      //   self.type =
      //     result[1].data.listType[
      //       result[1].data.listType
      //         .map(function (e) {
      //           return e.id;
      //         })
      //         .indexOf(self.product.typeId)
      //     ].name;
      // });
      // self.specs = self.productService.convertSpecs(self.product.specs);
    });
    self.quantityForm = new FormGroup({
      quantity: new FormControl(1, Validators.compose([Validators.min(1), Validators.required, Validators.max(10)]))
    });

    self.quantityForm.valueChanges.subscribe((v) => {
      self.disableMin = self.disableAdd = false;
      if (v.quantity <= 1) {
        self.disableMin = true;
      }
      if (v.quantity >= 10) {
        self.disableAdd = true;
      }
    });

  }

  // getTypesAndBrands() {
  //   const self = this;
  //   return forkJoin(self.productService.getListBrand(), self.productService.getListType());
  // }

  minQuantity() {
    const self = this;
    if (self.quantityForm.controls.quantity.value > 1) {
      self.quantityForm.controls.quantity.setValue(self.quantityForm.controls.quantity.value - 1);
    }
  }

  addQuantity() {
    const self = this;
    if (self.quantityForm.controls.quantity.value < 10) {
      self.quantityForm.controls.quantity.setValue(self.quantityForm.controls.quantity.value + 1);
    }
  }

  addCart(value) {
    const self = this;
    if (!self.accountService.getAccessToken()) {
      self.router.navigate(['/login']);
    } else {
      self.productService.addCart(self.product, value.quantity);
      swal({
        title: 'Congratulations!',
        text: 'Add product to cart successfully.',
        icon: 'success'
      });
    }
  }
}
