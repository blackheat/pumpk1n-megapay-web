import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  listProducts = [];
  currentPage = 1;
  totalPage = 1;
  closeResult: string;
  product;
  productIndex;
  productForm: FormGroup;
  filterForm: FormGroup;
  filterValue = {
    nameFilter: ''
  };
  mode: string;
  title: string;
  emitter: EventEmitter<boolean>;
  constructor(private productService: ProductService, private modalService: NgbModal, private spinnerService: SpinnerService) { }

  ngOnInit() {
    const self = this;
    self.emitter = self.spinnerService.listener;
    self.filterForm = new FormGroup({
      nameFilter: new FormControl(''),
    });
    self.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.compose([Validators.min(1000000), Validators.required])),
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      deprecated: new FormControl(false, null)
    });
    self.getListProducts(1, self.filterValue);
  }

  getListProducts(page, filter) {
    const self = this;
    self.emitter.emit(true);
    self.productService
      .getSearchFilter(page, MAX_PRODUCTS_ROW_PER_PAGE, filter.nameFilter)
      .subscribe((v: any) => {
        self.emitter.emit(false);
        if (v.responseType === 'success') {
          self.listProducts = v.data;
          self.currentPage = page;
          self.totalPage = v.data.numberOfPage;
        }
      });
  }

  goToPage(value) {
    const self = this;
    self.getListProducts(value, self.filterValue);
  }
  open(content, mode) {
    const self = this;
    self.clearForm();
    self.mode = mode;
    self.modalService
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


  getProductDetail(product, index) {
    const self = this;
    self.productIndex = index;
    self.productForm.controls['name'].setValue(product.name);
    self.productForm.controls['image'].setValue(product.image);
    self.productForm.controls['price'].setValue(product.price);
    self.productForm.controls['deprecated'].setValue(product.deprecated);
    self.productForm.controls['description'].setValue(product.longDescription);
    self.productForm.controls['shortDescription'].setValue(product.shortDescription);
    self.emitter.emit(true);
    self.productService.getProductById(product.id).subscribe((value: any) => {
      self.emitter.emit(false);
      self.product = value.data;
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

      !formControl.image.value.trim() || !formControl.image.value ? 'Product image URL is required.' : null,

      !formControl.description.value.trim() || !formControl.description.value
        ? 'Product description is required.'
        : null,

      !formControl.shortDescription.value.trim() || !formControl.shortDescription.value
        ? 'Product short description is required.'
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
      self.open(self.modal, self.mode);
      return;
    }

    self.mode === 'add' ? self.addProduct(value) : self.editProduct(value);

  }

  addProduct(value) {
    const self = this;
    self.productService.addProduct(value).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        swal({
          title: 'Congratulations',
          text: 'Product is added successfully.',
          icon: 'success'
        }).then(() => {
          self.getListProducts(self.currentPage, self.filterValue);
        });
      }
    });
  }

  editProduct(value) {
    const self = this;
    value.id = self.product.id;
    self.productService.modifyProduct(value).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        swal({
          title: 'Congratulations',
          text: 'Product is edited successfully.',
          icon: 'success'
        }).then(() => {
          self.product.name = value.name;
          self.product.price = value.price;
          self.product.longDescription = value.description;
          self.product.shortDescription = value.shortDescription;
          self.product.image = value.image;
          self.product.deprecated = value.deprecated;

          self.listProducts[self.productIndex] = self.product;
        });
      }
    });
  }

  filter(value) {
    const self = this;
    self.filterValue = value;
    self.emitter.emit(true);
    self.getListProducts(1, self.filterValue);
  }

  clearForm() {
    const self = this;
    self.product = {};
    self.productForm.controls['name'].setValue('');
    self.productForm.controls['image'].setValue('');
    self.productForm.controls['price'].setValue('');
    self.productForm.controls['deprecated'].setValue('');
    self.productForm.controls['description'].setValue('');
    self.productForm.controls['shortDescription'].setValue('');
  }

  changeStockStatus(product, index) {
    const self = this;
    self.emitter.emit(true);
    self.productService.changeStockStatus(product).subscribe(v => {
      self.emitter.emit(false);
      swal({
        title: 'Congratulations',
        text: 'Change stock status successfully.',
        icon: 'success'
      }).then(() => {
        self.listProducts[index].outOfStock = !self.listProducts[index].outOfStock;
      });
    })
  }
}
