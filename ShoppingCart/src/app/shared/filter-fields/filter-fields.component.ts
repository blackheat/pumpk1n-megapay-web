import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: ['./filter-fields.component.css']
})
export class FilterFieldsComponent implements OnInit {
  models = ['DELL', 'HP', 'ASUS', 'LENOVO'];
  filterForm: FormGroup;

  constructor() { }

  ngOnInit() {
    const self = this;
    self.filterForm = new FormGroup({
      productName: new FormControl(),
      productPrice: new FormControl(),
      productModel: new FormControl()
    });
   }


  Search(value) {
    console.log(value);
  }
}
