import { Component, OnInit, ViewChild } from '@angular/core';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: [ './product-management.component.css' ]
})
export class ProductManagementComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  listProducts = [];
  currentPage = 1;
  totalPage = 1;
  closeResult: string;
  product;
  isShowingSpinner = false;
  brand;
  type;
  brands = [];
  types = [];
  productIndex;
  productForm: FormGroup;
  filterForm: FormGroup;
  filterValue = {
    nameFilter: '',
    typeFilter: 0,
    brandFilter: 0
  };
  constructor(private productService: ProductService, private modalService: NgbModal) {}

  ngOnInit() {
    const self = this;
    self.filterForm = new FormGroup({
      nameFilter: new FormControl(''),
      typeFilter: new FormControl(0),
      brandFilter: new FormControl(0)
    });
    self.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.compose([ Validators.min(1000000), Validators.required ])),
      brand: new FormControl('', null),
      type: new FormControl('', null),
      quantity: new FormControl('', Validators.compose([ Validators.min(0), Validators.required ])),
      specs: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isDeleted: new FormControl(false, null)
    });
    self.getTypesAndBrands().subscribe((result: any) => {
      self.isShowingSpinner = false;
      result[0].data.listBrands.forEach((brand) => {
        self.brands.push(brand);
      });
      result[1].data.listType.forEach((type) => {
        self.types.push(type);
      });
    });
    self.getListProducts(1, self.filterValue);
  }

  getListProducts(page, filter) {
    const self = this;
    self.productService
      .getSearchFilter(page, MAX_PRODUCTS_ROW_PER_PAGE, filter.nameFilter, null, filter.typeFilter, filter.brandFilter)
      .subscribe((v: any) => {
        if (v.returnMessage === 'SUCCESS') {
          self.listProducts = v.data.listProducts;
          self.currentPage = page;
          self.totalPage = v.data.numberOfPage;
        }
        if (v.returnMessage === 'PRODUCT_NOT_FOUND') {
          self.listProducts = [];
          self.currentPage = 1;
          self.totalPage = 1;
        }
      });
  }

  goToPage(value) {
    const self = this;
    self.getListProducts(value, self.filterValue);
  }
  open(content) {
    const self = this;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'modal-wide' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getTypesAndBrands() {
    const self = this;
    return forkJoin(self.productService.getListBrand(), self.productService.getListType());
  }

  getProductDetail(product, index) {
    const self = this;
    self.productIndex = index;
    self.productForm.controls['name'].setValue(product.name);
    self.productForm.controls['price'].setValue(product.price);
    self.productForm.controls['quantity'].setValue(product.leftItems);
    self.productForm.controls['isDeleted'].setValue(product.isDeleted);
    self.productForm.controls['specs'].setValue(
      self.productService.converJsonToMultipleLinesString(self.productService.convertSpecs(product.specs))
    );
    self.productForm.controls['description'].setValue(product.description);
    self.productService.getProductById(product.id).subscribe((value: any) => {
      self.product = value.data.product;
      self.getTypesAndBrands().subscribe((result: any) => {
        self.isShowingSpinner = false;
        self.brand =
          result[0].data.listBrands[
            result[0].data.listBrands
              .map(function(e) {
                return e.id;
              })
              .indexOf(self.product.brandId)
          ];
        self.type =
          result[1].data.listType[
            result[1].data.listType
              .map(function(e) {
                return e.id;
              })
              .indexOf(self.product.typeId)
          ];
        self.productForm.controls['brand'].setValue(self.brand.id);
        self.productForm.controls['type'].setValue(self.type.id);
      });
    });
  }

  validate() {
    const self = this;
    const formControl = self.productForm.controls;

    const errors = [
      !formControl.name.value.trim() || !formControl.name.value ? 'Product name is required.' : null,

      !formControl.price.value
        ? 'Product price is required.'
        : formControl.price.value < 1000000 ? 'Product price cannot be lower than 1000000' : null,

      !formControl.brand.value ? 'Product brand is required.' : null,

      !formControl.type.value ? 'Product type is required.' : null,

      !formControl.price.value
        ? `Product's available quantity is required.`
        : formControl.price.value < 0 ? `Product's available quantity cannot be lower than 0` : null,

      !formControl.specs.value.trim() || !formControl.specs.value ? 'Product specs is required.' : null,

      !formControl.description.value.trim() || !formControl.description.value
        ? 'Product description is required.'
        : null
    ];

    return errors.filter((e) => e != null).join('\n');
  }

  onSubmit(value) {
    const self = this;

    if (self.validate() !== '') {
      swal({
        title: 'Failed to edit product',
        text: self.validate(),
        icon: 'error'
      });
      self.open(self.modal);
      return;
    }
    value.id = self.product.id;
    let specs = value.specs.replace(/\n/gi, ',');
    specs = `{${specs}}`;
    value.specs = specs;
    self.productService.modifyProduct(value).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        swal({
          title: 'Congratulations',
          text: 'Product is edited successfully.',
          icon: 'success'
        }).then(() => {
          self.product.name = value.name;
          self.product.price = value.price;
          self.product.brandId = value.brand;
          self.product.typeId = value.type;
          self.product.leftItems = value.quantity;
          self.product.description = value.description;
          self.product.specs = value.specs;
          self.product.isDeleted = value.isDeleted;

          self.listProducts[self.productIndex] = self.product;
        });
      }
    });
  }

  filter(value) {
    const self = this;
    self.filterValue = value;
    self.getListProducts(1, self.filterValue);
  }
}
