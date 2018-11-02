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
import { AccountService } from '../services/account.service';
import { switchAll } from '../../../node_modules/rxjs/operators';
import swal from 'sweetalert';
import { NavbarComponent } from '../shared/navbar/navbar.component';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }

}
