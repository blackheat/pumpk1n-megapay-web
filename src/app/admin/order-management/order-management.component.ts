import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order.service';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { isValidDate } from '../../shared/validators/validators';
import { convertDate } from '../../shared/constants';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: [ './order-management.component.css' ]
})
export class OrderManagementComponent implements OnInit {
  currentPage = 1;
  totalPage = 1;
  order = new Object();
  listOrders;
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
  emitter: EventEmitter<boolean>;
  constructor(
    private service: OrderService,
    private accountService: AccountService,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal, 
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    const self = this;
    self.emitter = self.spinnerService.listener;
    self.filterForm = new FormGroup({
      orderId: new FormControl('', null),
      dateFrom: new FormControl('', null),
      dateTo: new FormControl('', null),
    });
    self.getListOrders(1);
  }

  getFilter() {
    const self = this;
    const filter = new Object;
    (<any>filter).orderId = self.filterForm.controls['orderId'].value;
    (<any>filter).dateFrom = convertDate(self.filterForm.controls['dateFrom'].value, 'MMddyyyy');
    (<any>filter).dateTo = convertDate(self.filterForm.controls['dateTo'].value, 'MMddyyyy');
    return filter;
  }

  getListOrders(page) {
    const self = this;
    self.emitter.emit(true);
    const filter = self.getFilter();
    self.service.getListOrders(page, filter).subscribe((value: any) => {
      self.emitter.emit(false);
      if (value.responseType === 'success') {
        self.currentPage = page;
        self.totalPage = value.paginationReturnData.totalPages;
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
      self.emitter.emit(true);
      self.productService.getProductById(product.productId).subscribe((v: any) => {
        if ((v.returnMessage = 'SUCCESS')) {
          (<any>self.order).listProducts.push({ product: v.data.product, quantity: product.quantity });
        }
        self.emitter.emit(false);
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  onChange(value) {
    const self = this;
    self.selectedState = value;
  }

  changeState() {
    const self = this;
    (<any>self.order).state = self.selectedState;
    self.service.modifyOrder(self.order).subscribe((v: any) => {
      if (v.responseType === 'success') {
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

  validate() {
    const self = this;

    const dF = convertDate(self.filterForm.controls['dateFrom'].value, 'MMddyyyy');
    const dT = convertDate(self.filterForm.controls['dateTo'].value, 'MMddyyyy');
    const errors = [
      self.filterForm.controls['dateFrom'].value &&
      !isValidDate(convertDate(self.filterForm.controls['dateFrom'].value, 'ddMMyyyy')) ? 'Date from is invalid.' : null,

      self.filterForm.controls['dateTo'].value &&
      !isValidDate(convertDate(self.filterForm.controls['dateTo'].value, 'ddMMyyyy')) ? 'Date to is invalid.' : null,

      dF && dT && new Date(dF) > new Date(dT) ? 'Date From value cannot precede Date To value' : null

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
    self.getListOrders(1);
  }
}
