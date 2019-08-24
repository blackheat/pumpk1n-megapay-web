import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { switchAll } from '../../../../node_modules/rxjs/operators';
import swal from 'sweetalert';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BalanceService } from 'src/app/services/balance.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: string;
  password: string;
  constructor(private router: Router, private service: AccountService, private balanceService: BalanceService) { }

  ngOnInit() {
    const self = this;
    if (self.service.isLoggedIn()) {
      self.router.navigate(['/home']);
    }
    self.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(value) {
    const self = this;
    this.service.login(value).subscribe((r) => {
      swal({
        title: 'Congratulations!',
        text: 'Login successfully.',
        icon: 'success'
      }).then(() => {
        self.router.navigate(['/home']);
        self.balanceService.updateBalanceEmitter.emit('login');
      });
    }, (e) => {
      swal({
        title: 'Error!',
        text: 'ID or password is incorrect.',
        icon: 'error'
      });
    });
  }
}
