import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { switchAll } from '../../../../node_modules/rxjs/operators';
import swal from 'sweetalert';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  id: string;
  password: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AccountService
  ) {
  }

  ngOnInit() {

    if (this.service.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit(value) {
  //   this.service.Login(value).subscribe(
  //     (result: any[]) => {
  //       swal({
  //         title: 'Congratulations!',
  //         text: 'Login successfully.',
  //         icon: 'success'
  //       });
  //       this.router.navigate(['/home']);
  //     },
  //     error => {
  //       swal({
  //         title: 'Error!',
  //         text: 'ID or password is incorrect.',
  //         icon: 'error'
  //       });
  //     }
  //   );
  }
}
