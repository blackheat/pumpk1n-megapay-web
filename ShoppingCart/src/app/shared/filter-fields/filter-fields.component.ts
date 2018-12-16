import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl
} from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { forkJoin } from 'rxjs';

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
    self.filterForm = new FormGroup({
      productName: new FormControl(''),
      priceOption: new FormControl(''),
      typeId: new FormControl(0),
      brandId: new FormControl(0)
    });
    self.getTypesAndBrands().subscribe((result: any) => {
      self.isShowingSpinner = false;
      result[0].data.listBrands.forEach((brand) => {
        self.brands.push(brand);
      });
      result[1].data.listType.forEach((type) => {
        self.types.push(type);
      });
    });
  }

  getTypesAndBrands() {
    const self = this;
    return forkJoin(self.service.getListBrand(), self.service.getListType());
  }
  Search(value) {
    const self = this;
    self.searchFilter.emit(value);
  }
}
