import {
  Component,
  OnInit,
  Input,
  EventEmitter
} from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { NgbModal } from 'node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  auth: boolean;
  listener: EventEmitter<any>;
  constructor(private service: AccountService,
    private router: Router,
    private modalService: NgbModal) {
    this.listener = service.listener;
    this.listener.subscribe(() => {
      this.auth = this.service.isLoggedIn();
    });
  }
  numberOfProducts = 0;

  logout() {
    this.auth = !this.auth;
    this.service.Logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.auth = this.service.isLoggedIn();
  }
}
