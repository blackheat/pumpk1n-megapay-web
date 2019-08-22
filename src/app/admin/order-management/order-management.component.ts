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
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  currentPage = 1;
  totalPage = 1;
  order = new Object();
  listOrders;
  closeResult: string;
  selectedState;
  orderIndex = -1;
  filterForm: FormGroup;
  emitter: EventEmitter<boolean>;
  constructor(
    private service: OrderService,
    private accountService: AccountService,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal,
    private spinnerService: SpinnerService
  ) { }

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

  getListOrders(page) {
    const self = this;
    self.emitter.emit(true);
    self.service.getListOrders(page).subscribe((value: any) => {
      self.emitter.emit(false);
      if (value.responseType === 'success') {
        self.currentPage = page;
        self.totalPage = value.paginationReturnData.totalPages;
        self.listOrders = value.data;
      }
    });
  }

  getOrderDetail(value, index) {
    const self = this;
    self.orderIndex = index;
    self.order = value;
  }

  getOrderTotal() {
    const self = this;
    let total = 0;
    (<any>self.order).items.forEach((item) => {
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

  confirm(order) {
    const self = this;
    self.service.confirm(order.id).subscribe((v: any) => {
      if (v.responseType === 'success') {
        swal({
          title: 'Success!',
          text: 'Confirm order successfully!!!',
          icon: 'success'
        });
        self.goToPage(self.currentPage);
      }
    });
  }

  cancel(order) {
    const self = this;
    self.service.cancel(order.id).subscribe((v: any) => {
      if (v.responseType === 'success') {
        swal({
          title: 'Success!',
          text: 'Cancel order successfully!!!',
          icon: 'success'
        });
        self.goToPage(self.currentPage);
      }
    });
  }
}
