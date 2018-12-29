import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../services/order.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { isValidDate } from '../shared/validators/validators';
import { convertDate } from '../shared/constants';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: [ './employee.component.css' ]
})
export class EmployeeComponent implements OnInit {
  currentPage = 1;
  totalPage = 1;
  order = new Object();
  listOrders;
  isShowingSpinner = false;
  closeResult: string;
  selectedState;
  orderIndex = -1;
  states = [
    {
      title: 'Pending',
      value: 'Chưa giao'
    },
    {
      title: 'Delivering',
      value: 'Đang giao'
    },
    {
      title: 'Done',
      value: 'Đã giao'
    }
  ];
  filterForm: FormGroup;
  constructor(
    private service: OrderService,
    private accountService: AccountService,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const self = this;
    self.getListOrders(1);
    self.filterForm = new FormGroup({
      orderId: new FormControl('', null),
      dateFrom: new FormControl('', null),
      dateTo: new FormControl('', null),
    });
  }

  getListOrders(page) {
    const self = this;
    self.isShowingSpinner = true;
    self.service.getListOrders(page).subscribe((value: any) => {
      self.isShowingSpinner = false;
      if (value.returnMessage === 'SUCCESS') {
        self.currentPage = page;
        self.totalPage = value.data.numberOfPage;
        self.listOrders = value.data.listOrders;
      }
    });
  }

  getOrderDetail(value, index) {
    const self = this;
    self.orderIndex = index;
    const list = JSON.parse(value.products);
    (<any>self.order).listProducts = [];
    (<any>self.order).id = value.id;
    (<any>self.order).userId = value.userId;
    (<any>self.order).createDate = value.createDate;
    (<any>self.order).state = value.state;
    list.forEach((product) => {
      self.isShowingSpinner = true;
      self.productService.getProductById(product.productId).subscribe((v: any) => {
        if ((v.returnMessage = 'SUCCESS')) {
          (<any>self.order).listProducts.push({ product: v.data.product, quantity: product.quantity });
        }
        self.isShowingSpinner = false;
      });
    });
  }

  getOrderTotal() {
    const self = this;
    let total = 0;
    (<any>self.order).listProducts.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
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
  onChange(value) {
    const self = this;
    self.selectedState = value;
  }

  changeState() {
    const self = this;
    (<any>self.order).state = self.selectedState;
    self.service.modifyOrder(self.order).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        swal({
          title: 'Congratulations',
          text: 'State is changed successfully.',
          icon: 'success'
        }).then(() => {
          self.listOrders[self.orderIndex].state = self.selectedState;
        });
      }
    });
  }

  goToPage(page) {
    const self = this;
    self.getListOrders(page);
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
    const date =  Date.parse(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy').toString());

    const errors = [
      self.filterForm.controls['dateFrom'].value &&
      !isValidDate(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy')) ? 'Date from is invalid.' : null,

      self.filterForm.controls['dateTo'].value &&
      !isValidDate(convertDate(self.filterForm.controls['dateTo'].value, 'ddMMyyyy')) ? 'Date to is invalid.' : null,

      isValidDate(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy')) &&
      isValidDate(convertDate(self.filterForm.controls['dateTo'].value, 'ddMMyyyy')) &&
      Date.parse(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy').toString()) >
      Date.parse(convertDate(self.filterForm.controls['dateTo'].value, 'ddMMyyyy').toString()) ?
      'Date From value cannot precede Date To value' : null

    ];

    return errors.filter((e) => e != null).join('\n');
  }

  filter(value) {
    const self = this;
    if (self.validate() !== '') {
      swal({
        title: 'Failed to filter orders!',
        text: self.validate(),
        icon: 'error'
      });
      return;
    }
  }
}
