import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from '../services/account.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.css' ]
})
export class CartComponent implements OnInit {
  cart;
  order = new Object();
  currentPage;
  totalPage = 0;
  listOrders;
  isShowingSpinner;
  closeResult: string;
  constructor(
    private service: ProductService,
    private accountService: AccountService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const self = this;
    self.currentPage = 1;
    self.cart = self.service.getCart();
    self.updateOrdersHistory();
  }

  updateOrdersHistory() {
    const self = this;
    self.isShowingSpinner = true;
    self.service.getOrdersHistory(1).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        self.listOrders = v.data.listOrders;
        self.totalPage = v.data.numberOfPage;
      }
      self.isShowingSpinner = false;
    });
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
    (<any>self.order).listProducts.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  }

  checkout() {
    const self = this;
    if (!self.service.getCart() || self.service.getCart().listProducts.length <= 0) {
      swal({
        title: 'Error!',
        text: 'Cart is empty.',
        icon: 'error'
      });
      return;
    }
    swal({
      title: 'Are you sure?',
      text: 'Do you want to checkout?',
      icon: 'info',
      buttons: [ 'No', 'Yes' ]
    }).then((v) => {
      if (v) {
        const listProducts = [];
        self.cart.listProducts.forEach((item) => {
          listProducts.push({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          });
        });
        const result = new Object();
        (<any>result).items = JSON.stringify(listProducts);
        (<any>result).token = self.accountService.getAccessToken();

        self.service.checkout(result).subscribe((value: any) => {
          if (value.returnMessage === 'SUCCESS') {
            swal({
              title: 'Congratulations',
              text: 'Checkout successfully!',
              icon: 'success'
            }).then(() => {
              self.service.emptyCart();
              self.cart = self.service.getCart();
              self.updateOrdersHistory();
            });
          }
          if (value.returnMessage === 'PRODUCT_OVER_QUANTITY') {
            swal({
              title: 'Checkout unsuccessfully!',
              text: 'Product is insufficient.',
              icon: 'error'
            });
          }
        });
      }
    });
  }
  open(content) {
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

  goToPage(page) {
    const self = this;
    self.service.getOrdersHistory(page).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        self.listOrders = v.data.listOrders;
        self.totalPage = v.data.numberOfPage;
        self.currentPage = page;
      }
      self.isShowingSpinner = false;
    });
  }

  getOrderDetail(value) {
    const self = this;
    const list = JSON.parse(value.products);
    (<any>self.order).listProducts = [];
    list.forEach((product) => {
      self.isShowingSpinner = true;
      self.service.getProductById(product.productId).subscribe((v: any) => {
        if ((v.returnMessage = 'SUCCESS')) {
          (<any>self.order).listProducts.push({product: v.data.product, quantity: product.quantity});
        }
        self.isShowingSpinner = false;
      });
    });
  }
}
