import { Component, OnInit, EventEmitter } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ProductService } from '../services/product.service';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole;
  slides = [
    'https://images-eu.ssl-images-amazon.com/images/G/39/electronics/store/1132224_CE_Mobiles_Computers_Office_AllComputers_Accessories_ATF_Laptops_992x515_en.jpg?fbclid=IwAR28WEajjXFwJvk_7JGAbYXMdnCXnqDl4yImS9T5s96JrPGPfcYYqik9TjI',
    'https://cdn.mos.cms.futurecdn.net/eiK4GXLAa3DX8Qn6emxNcP-650-80.jpg?fbclid=IwAR2b-NN-xJ3wc--qruB0aUvoPDolktZ9gq52MtAcfoo6M2gCme6H7-QPPxU',
    'https://mrbendeals.com/wp-content/uploads/2019/05/maxresdefault.jpg?fbclid=IwAR2JdVtWpP0qMDBR0hXhyxupU1x5w2rPDWohweSKA0-sKbAJH81FG28efYo',
    'https://rog.asus.com/media/1546852826561.jpg?fbclid=IwAR0y5gJNjRkUgwN36LfiyfVqy-K7qOsd5iqpK_HlYQbk9QEGxJBrEs7tOzM'
  ];
  products = [];
  constructor(private service: ProductService, private accountService: AccountService, private spinnerService: SpinnerService) { }
  isShowingSpinner = true;
  options: any;
  ngOnInit() {
    const self = this;
    self.options = {
      dots: false,
      responsive: {
        '0': { items: 1 },
        '400': { items: 2 },
        '550': { items: 3 },
        '670': { items: 4 }
      },
      autoplay: true,
      loop: true,
      autoplayTimeout: 3000,
      lazyLoad: true
    };
    self.service.getNewestProducts().subscribe((result: any) => {
      self.isShowingSpinner = false;
      result.data.forEach(product => {
        self.products.push(product);
      });
    });
    self.spinnerService.listener.subscribe((v) => {
      self.isShowingSpinner = v;
    });
    self.userRole = self.accountService.getUserRole();
  }
}
