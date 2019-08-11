import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BalanceService } from '../services/balance.service';
import { V } from '@angular/core/src/render3';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  closeResult: string;
  topupForm: FormGroup;
  balance;
  constructor(private modalService: NgbModal, public service: BalanceService) { }

  ngOnInit() {
    const self = this;
    self.topupForm = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    });
    self.service.getBalanceToken().subscribe((v: any) => {
      if (v.responseType === 'success') {
        self.balance = v.data.balance;
      }
    })
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

    self.service.topup(value).subscribe((v: any) => {
      swal({
        title: 'Congratulations!',
        text: 'Token Topup Request Created Successfully.',
        icon: 'success'
      });
    })
  }
}
