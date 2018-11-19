import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { forkJoin } from 'rxjs';
import { DEFAULT_OBJECT } from '../constants';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: [ './filter-fields.component.css' ]
})
export class FilterFieldsComponent implements OnInit {
  brands = [];
  types = [];
  filterForm: FormGroup;
  isShowingSpinner = true;
  @Output() searchFilter: EventEmitter<any> = new EventEmitter();
  constructor(private service: ProductService) {}

  ngOnInit() {
    const self = this;
    self.brands.push(DEFAULT_OBJECT);
    self.types.push(DEFAULT_OBJECT);
    self.filterForm = new FormGroup({
      productName: new FormControl(''),
      priceOption: new FormControl(0),
      typeId: new FormControl(0),
      brandId: new FormControl(0)
    });
    self.searchFilter.emit(self.filterForm.value);
    self.getTypesAndBrands().subscribe((result: any) => {
      self.isShowingSpinner = false;
      result[0].forEach((brand) => {
        self.brands.push(brand);
      });
      result[1].forEach((type) => {
        self.types.push(type);
      });
      self.isShowingSpinner = false;
    });
  }

  getTypesAndBrands() {
    const self = this;
    return forkJoin(self.service.getListBrand(), self.service.getListType());
  }
  Search(value) {
    // console.log(value);
    const self = this;
    self.searchFilter.emit(value);
  }
}
