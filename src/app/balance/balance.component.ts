import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from '../services/balance.service';
import { V } from '@angular/core/src/render3';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  closeResult: string;
  showAction = false;
  topupForm: FormGroup;
  balance;
  currentPage = 1;
  totalPages = 1;
  topupList = [];
  isShowingSpinner = false;
  constructor(private modalService: NgbModal, private service: BalanceService) { }

  ngOnInit() {
    const self = this;
    self.topupForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    });
    self.getBalance();
    self.getTopupList();
  }

  getTopupList(page = 1) {
    const self = this;
    self.isShowingSpinner = true;
    self.service.getTopupRequests(page).subscribe((v: any) => {
      self.isShowingSpinner = false;
      if (v.responseType === 'success') {
        self.topupList = v.data;
        self.currentPage = page;
        self.totalPages = v.paginationReturnData.totalPages;
      }
    });
  }

  getBalance() {
    const self = this;
    self.isShowingSpinner = true;
    self.service.getBalanceToken().subscribe((v: any) => {
      self.isShowingSpinner = false;
      if (v.responseType === 'success') {
        self.balance = v.data.balance;
      }
    });
  }

  open(content) {
    const self = this;
    self.clearForm();
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
  clearForm() {
    const self = this;
    self.topupForm.controls['amount'].setValue('');
    self.topupForm.controls['notes'].setValue('');
  }
  validate() {
    const self = this;
    const formControl = self.topupForm.controls;

    const errors = [

      !formControl.amount.value
        ? 'Topup amount is required.'
        : formControl.amount.value <= 0 ? 'Topup amount must be greater than 0' : null,

    ];

    return errors.filter((e) => e != null).join('\n');
  }

  onSubmit(value) {
    const self = this;

    if (self.validate() !== '') {
      swal({
        title: 'Failed to topup',
        text: self.validate(),
        icon: 'error'
      });
      self.open(self.modal);
      return;
    }

    const index = self.topupList.findIndex(item => {
      return item.confirmedDate < item.createdDate && item.cancelledDate < item.createdDate;
    });

    if (index >= 0) {
      swal({
        title: 'Warning!',
        text: 'All transactions must be paid before requesting new topup transaction.',
        icon: 'warning'
      })
      self.clearForm();
      return;
    }
    self.isShowingSpinner = true;
    self.service.topup(value).subscribe((v: any) => {
      self.isShowingSpinner = false;
      swal({
        title: 'Congratulations!',
        text: 'Token Topup Request Created Successfully.',
        icon: 'success'
      }).then(() => {
        self.getTopupList();
        self.clearForm();
      })
    })
  }

  pay(id) {
    const self = this;
    self.isShowingSpinner = true
    self.service.getTopupById(id).subscribe((v: any) => {
      self.isShowingSpinner = false;
      if (v.responseType === 'success') {
        if (!v.data.paymentInvoices || v.data.paymentInvoices.length <= 0) {
          self.service.payForTopup(id).subscribe((u: any) => {
            window.open(u.data.gatewayInvoiceReferenceLink, '_blank');
            swal({
              title: 'In progress...',
              text: 'Token is being paying. Press OK to reload.',
              icon: 'info'
            }).then(() => {
              self.getTopupList(self.currentPage);
              self.getBalance();
              self.service.updateBalanceEmitter.emit('update');
            })
          });
        } else {
          window.open(v.data.paymentInvoices[0].gatewayInvoiceReferenceLink, '_blank');
          swal({
            title: 'In progress...',
            text: 'Token is being paying. Press OK to reload.',
            icon: 'info'
          }).then(() => {
            self.getTopupList(self.currentPage);
            self.getBalance();
            self.service.updateBalanceEmitter.emit('update');
          })
        }

      }
    });
  }

  cancel(id) {
    const self = this;
    swal({
      title: 'Warning',
      text: 'Are you sure to cancel this topup?',
      icon: 'info',
      buttons: ['No', 'Yes']
    }).then((result) => {
      if (result) {
        self.service.cancelTopup(id).subscribe((v: any) => {
          if (v.responseType === 'success') {
            swal({
              title: 'Congratulations!',
              text: 'Topup is cancelled successfully.',
              icon: 'success'
            }).then(() => {
              self.getTopupList();
            })
          }
        });
      }
    });
  }

  goToPage(page) {
    const self = this;
    self.getTopupList(page);
  }
}
