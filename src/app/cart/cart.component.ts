import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from '../services/balance.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  cart;
  orderForm: FormGroup;
  order = new Object();
  listOrders;
  isShowingSpinner;
  closeResult: string;
  constructor(
    private service: ProductService,
    private orderService: OrderService,
    private balanceService: BalanceService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const self = this;
    self.cart = self.service.getCart();
    self.orderForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      notes: new FormControl(''),
    });
    self.updateOrdersHistory();
  }

  updateOrdersHistory() {
    const self = this;
    self.isShowingSpinner = true;
    self.orderService.getOrdersHistory(1).subscribe((v: any) => {
      self.isShowingSpinner = false;
      if (v.responseType === 'success') {
        self.listOrders = v.data;
      }
    });
  }

  getOrderDetail(order) {
    const self = this;
    self.order = order;
  }

  deleteCart(id) {
    const self = this;
    self.service.deleteCart(id);

    const index = self.cart.listProducts
      .map(function (e) {
        return e.id;
      })
      .indexOf(id);
    self.cart.listProducts.splice(index, 1);
  }

  navigate(id) {
    const self = this;
    self.router.navigate(['/products/', id]);
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

  getTotal() {
    const self = this;
    let total = 0;
    self.cart.listProducts.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  getOrderTotal() {
    const self = this;
    let total = 0;
    (<any>self.order).items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  checkout(form) {
    const self = this;
    if (!self.service.getCart() || self.service.getCart().listProducts.length <= 0) {
      swal({
        title: 'Error!',
        text: 'Cart is empty.',
        icon: 'error'
      });
      return;
    }
    if (self.validate() !== '') {
      swal({
        title: 'Failed to edit product',
        text: self.validate(),
        icon: 'error'
      });
      self.open(self.modal);
      return;
    }

    swal({
      title: 'Are you sure?',
      text: 'Do you want to checkout?',
      icon: 'info',
      buttons: ['No', 'Yes']
    }).then((v) => {
      if (v) {
        let total = 0;
        const items = [];
        self.isShowingSpinner = true;
        self.cart.listProducts.forEach((item) => {
          total += item.product.price;
          items.push({
            productId: item.product.id,
            quantity: item.quantity
          });
        });
        self.balanceService.getBalanceToken().subscribe((b: any) => {
          if (b.data.balance < total) {
            swal({
              title: 'Error!',
              text: 'Failed to checkout! Your balance is not enough.',
              icon: 'error'
            });
            self.isShowingSpinner = false;
            return;
          }
          const value = {
            name: form.name,
            address: form.address,
            notes: form.notes,
            items: items
          };
          self.orderService.checkout(value).subscribe((r: any) => {
            self.isShowingSpinner = false;
            self.service.emptyCart();
            swal({
              title: 'Congratulations!',
              text: 'Checkout successfully!!!',
              icon: 'success'
            });
            return;
          });
        });
      }
    });
  }
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'modal-wide' })
      .result.then(
        (result) => {
          this.clearForm();
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.clearForm();
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

  validate() {
    const self = this;
    const formControl = self.orderForm.controls;

    const errors = [
      !formControl.name.value.trim() || !formControl.name.value ? 'Customer name is required.' : null,

      !formControl.address.value.trim() || !formControl.address.value ? 'Customer address is required.' : null,
    ];

    return errors.filter((e) => e != null).join('\n');
  }

  clearForm() {
    const self = this;
    self.orderForm.controls.name.setValue('');
    self.orderForm.controls.address.setValue('');
    self.orderForm.controls.notes.setValue('');
  }

}

