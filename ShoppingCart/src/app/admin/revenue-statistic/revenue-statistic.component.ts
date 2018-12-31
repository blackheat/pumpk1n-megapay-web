import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { isValidDate } from '../../shared/validators/validators';
import { convertDate, MAX_ORDERS_PER_PAGE } from '../../shared/constants';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-revenue-statistic',
  templateUrl: './revenue-statistic.component.html',
  styleUrls: [ './revenue-statistic.component.css' ]
})
export class RevenueStatisticComponent implements OnInit {
  currentPage = 1;
  totalPage = 1;
  dateFrom;
  dateTo;
  order = new Object();
  listOrders = [];
  closeResult: string;
  filterForm: FormGroup;
  searched = false;
  totalRevenue = 0;
  numberOfOrdersLastPage = 0;
  constructor(
    private service: OrderService,
    private productService: ProductService,
    private modalService: NgbModal,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const self = this;
    self.filterForm = new FormGroup({
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required)
    });
  }

  getFilter() {
    const self = this;
    const filterSearch = new Object();
    (<any>filterSearch).dateFrom = convertDate(self.filterForm.controls['dateFrom'].value, 'MMddyyyy');
    (<any>filterSearch).dateTo = convertDate(self.filterForm.controls['dateTo'].value, 'MMddyyyy');
    return filterSearch;
  }

  getListOrders(page) {
    const self = this;
    const filterSearch = self.getFilter();
    self.service.getListOrdersByDateRange(page, filterSearch).subscribe((value: any) => {
      if (value.returnMessage === 'SUCCESS') {
        self.currentPage = page;
        self.totalPage = value.data.numberOfPage;
        self.listOrders = value.data.listOrdersByRange;
      }
    });
  }

  getOrderDetail(value) {
    const self = this;
    const list = JSON.parse(value.products);
    (<any>self.order).products = [];
    (<any>self.order).id = value.id;
    (<any>self.order).userId = value.userId;
    (<any>self.order).createDate = value.createDate;
    (<any>self.order).state = value.state;
    list.forEach((product) => {
      self.productService.getProductById(product.productId).subscribe((v: any) => {
        if ((v.returnMessage = 'SUCCESS')) {
          (<any>self.order).products.push({ product: v.data.product, quantity: product.quantity });
        }
      });
    });
  }

  getOrderTotal(order) {
    let total = 0;
    const listProducts = JSON.parse(order.products);
    listProducts.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  getSpecificOrderTotal() {
    const self = this;
    let total = 0;
    const listProducts = (<any>self.order).products;
    listProducts.forEach((item) => {
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
    self.getListOrders(page);
  }

  validate() {
    const self = this;

    const dF = convertDate(self.filterForm.controls['dateFrom'].value, 'MMddyyyy');
    const dT = convertDate(self.filterForm.controls['dateTo'].value, 'MMddyyyy');
    const errors = [
      !self.filterForm.controls['dateFrom'].value
        ? `Date from is required`
        : !isValidDate(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy'))
          ? 'Date from is invalid.'
          : null,

      !self.filterForm.controls['dateTo'].value
        ? `Date to is required`
        : !isValidDate(convertDate(self.filterForm.controls['dateTo'].value, 'ddMMyyyy'))
          ? 'Date to is invalid.'
          : null,

      dF && dT && new Date(dF) > new Date(dT) ? 'Date From value cannot precede Date To value' : null
    ];

    return errors.filter((e) => e != null).join('\n');
  }

  getTotalRevenue() {
    const self = this;
    const filterSearch = self.getFilter();
    self.service.getListOrdersByDateRange(self.totalPage, filterSearch).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        const listProducts = v.data.listOrdersByRange;
        self.numberOfOrdersLastPage = listProducts.length;
        self.service.getListOrdersByDateRange(
          1,
          filterSearch,
          (self.totalPage - 1) * MAX_ORDERS_PER_PAGE + self.numberOfOrdersLastPage
        )
        .subscribe((val: any) => {
          if (val.returnMessage === 'SUCCESS') {
            const orders = val.data.listOrdersByRange;
            orders.forEach((order) => {
              self.totalRevenue += self.getOrderTotal(order);
            });
          }
        });
      }
    });
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
    self.getListOrders(1);
    self.dateFrom = (<any>self.getFilter()).dateFrom;
    self.dateTo = (<any>self.getFilter()).dateTo;
    self.totalRevenue = 0;
    self.searched = true;
    self.getTotalRevenue();
  }
}
