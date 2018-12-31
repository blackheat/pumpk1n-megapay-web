import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { convertDate } from '../shared/constants';
import { UserService } from '../services/user.service';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { isValidDate, isValidEmail } from '../shared/validators/validators';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: [ './user.component.css' ]
})
export class UserComponent implements OnInit {
  info;
  userForm: FormGroup;
  constructor(private service: UserService, private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    const self = this;
    self.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([ Validators.required ])),
      birthday: new FormControl('', null),
      address: new FormControl('', null),
      phone: new FormControl('', null)
    });

    self.service.getUserInfo().subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        self.info = v.data.info;
        const userFormControls = self.userForm.controls;
        userFormControls['name'].setValue(self.info[0].name);
        userFormControls['email'].setValue(self.info[0].email);
        const date = self.info[0].birthday ? self.info[0].birthday.split('/') : null;
        userFormControls['birthday'].setValue(date ?
          {
            year: parseInt(date[0], 10),
            month: parseInt(date[1], 10),
            day: parseInt(date[2], 10)
          } : '');
        userFormControls['address'].setValue(self.info[0].address ? self.info[0].address : '');
        const phone = self.info[0].phone ?
        self.info[0].phone[0] !== '0' ? '0' + self.info[0].phone.toString() :
        self.info[0].phone.toString() : null;
        userFormControls['phone'].setValue(phone ? phone : '');
      }
    });
  }

  onSubmit(value) {
    const self = this;
    if (self.validate() !== '') {
      swal({
        title: 'Failed to edit information!',
        text: self.validate(),
        icon: 'error'
      });
      return;
    }
    value.token = self.accountService.getAccessToken();
    self.service.modifyUserInfo(value).subscribe((v: any) => {
      if (v.returnMessage === 'SUCCESS') {
        swal({
          title: 'Congratulations!',
          text: 'Edit successfully.',
          icon: 'success'
        }).then(() => {
          self.accountService.setName(value.name);
          self.accountService.listener.emit();
          self.router.navigate(['/home']);
        });
      }
    });
  }

  validate() {
    const self = this;
    self.userForm.controls['phone'].setValue(
      self.userForm.controls['phone'].value && self.userForm.controls['phone'].value[0] !== '0' ?
       '0'+self.userForm.controls['phone'].value : self.userForm.controls['phone'].value); 
    const errors = [
      !self.userForm.controls['name'].valid ? 'Username is required.' : null,

      !isValidEmail(self.userForm.controls['email'].value)
        ? !self.userForm.controls['email'].value || !self.userForm.controls['email'].value.trim()
          ? 'Email is required.'
          : 'Email is invalid.'
        : null,

      !isValidDate(convertDate(self.userForm.controls['birthday'].value, 'ddMMyyyy')) ? 'Birthday is invalid.' : null,

      self.userForm.controls['phone'].value && 
      self.userForm.controls['phone'].value.length !== 10 ? 'Phone number must be 10 characters.' : null
    ];

    return errors.filter((e) => e != null).join('\n');
  }
}
