import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
}
