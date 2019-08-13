import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { NgbModal } from 'node_modules/@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { BalanceService } from 'src/app/services/balance.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  auth: boolean;
  listener: EventEmitter<any>;
  balanceEmitter: EventEmitter<any>;
  navSearchForm: FormGroup;
  username: string;
  userRole;
  balance = 0;
  numberOfProducts = 0;
  constructor(private accountService: AccountService,
    private productService: ProductService,
    private router: Router,
    private balanceService: BalanceService) {
    const self = this;
    self.listener = accountService.listener;
    self.balanceEmitter = balanceService.updateBalanceEmitter;
    self.listener.subscribe(() => {
      self.username = self.accountService.getName();
      self.userRole = self.accountService.getUserRole();
      self.auth = self.accountService.isLoggedIn();
    });
  }

  logout() {
    const self = this;
    self.auth = !self.auth;
    self.accountService.logout();
    self.userRole = null;
    self.router.navigate(['/login']);
  }

  ngOnInit() {
    const self = this;
    self.auth = self.accountService.isLoggedIn();
    self.username = self.accountService.getName();
    self.userRole = self.accountService.getUserRole();
    self.numberOfProducts = self.productService.getCart() ? self.productService.getCart().total : 0;
    self.productService.cartChange.subscribe(() => {
      self.numberOfProducts = self.productService.getCart().total;
    });
    if (self.auth) {
      self.getBalance();
      self.balanceEmitter.subscribe(v => {
        self.getBalance();
      });
    }
  }

  getBalance() {
    const self = this;
    self.balanceService.getBalanceToken().subscribe((v: any) => {
      if (v.responseType === 'success') {
        self.balance = v.data.balance;
      }
    });
  }
}
