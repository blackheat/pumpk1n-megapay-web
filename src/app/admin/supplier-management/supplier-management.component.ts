import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/services/supplier.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.css']
})
export class SupplierManagementComponent implements OnInit {
  @ViewChild('content') public modal: NgbModalRef;
  listSuppliers = [];
  currentPage = 1;
  totalPage = 1;
  closeResult: string;
  supplier;
  supplierIndex;
  supplierForm: FormGroup;
  filterForm: FormGroup;
  filterValue = {
    nameFilter: ''
  };
  mode: string;
  title: string;
  emitter: EventEmitter<boolean>;
  constructor(private service: SupplierService, private modalService: NgbModal, private spinnerService: SpinnerService) { }

  ngOnInit() {
    const self = this;
    self.emitter = self.spinnerService.listener;
    self.filterForm = new FormGroup({
      nameFilter: new FormControl(''),
    });
    self.supplierForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required),
    });
    self.getListSuppliers(1, self.filterValue);
  }

  getListSuppliers(page, filter) {
    const self = this;
    self.emitter.emit(true);
    self.service
      .getSearchFilter(page, MAX_PRODUCTS_ROW_PER_PAGE, filter.nameFilter)
      .subscribe((v: any) => {
        self.emitter.emit(false);
        if (v.responseType === 'success') {
          self.listSuppliers = v.data;
          self.currentPage = page;
          self.totalPage = v.data.numberOfPage;
        }
      });
  }

  goToPage(value) {
    const self = this;
    self.getListSuppliers(value, self.filterValue);
  }
  open(content, mode) {
    const self = this;
    self.clearForm();
    self.mode = mode;
    self.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'modal-wide' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  getSupplierDetail(supplier, index) {
    const self = this;
    self.supplierIndex = index;
    self.supplierForm.controls['name'].setValue(supplier.name);
    self.supplierForm.controls['description'].setValue(supplier.description);
    self.supplierForm.controls['address'].setValue(supplier.address);
    self.supplierForm.controls['telephone'].setValue(supplier.telephone);
    self.supplierForm.controls['website'].setValue(supplier.website);
    self.emitter.emit(true);
    self.service.getSupplierById(supplier.id).subscribe((value: any) => {
      self.emitter.emit(false);
      self.supplier = value.data;
    });
  }

  validate() {
    const self = this;
    const formControl = self.supplierForm.controls;

    const errors = [
      !formControl.name.value.trim() || !formControl.name.value ? 'Supplier name is required.' : null,

      !formControl.description.value.trim() || !formControl.description.value
        ? 'Supplier description is required.'
        : null,

      !formControl.address.value.trim() || !formControl.address.value
        ? 'Supplier address is required.'
        : null,

      !formControl.telephone.value.trim() || !formControl.telephone.value
        ? 'Supplier telephone is required.'
        : null,

      !formControl.website.value.trim() || !formControl.website.value
        ? 'Supplier website is required.'
        : null,
    ];

    return errors.filter((e) => e != null).join('\n');
  }

  onSubmit(value) {
    const self = this;

    if (self.validate() !== '') {
      swal({
        title: 'Failed to edit supplier',
        text: self.validate(),
        icon: 'error'
      });
      self.open(self.modal, self.mode);
      return;
    }

    self.mode === 'add' ? self.addSupplier(value) : self.editSupplier(value);

  }

  addSupplier(value) {
    const self = this;
    self.service.addSupplier(value).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        swal({
          title: 'Congratulations',
          text: 'Supplier is added successfully.',
          icon: 'success'
        }).then(() => {
          self.getListSuppliers(self.currentPage, self.filterValue);
        });
      }
    });
  }

  editSupplier(value) {
    const self = this;
    value.id = self.supplier.id;
    self.service.modifySupplier(value).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        swal({
          title: 'Congratulations',
          text: 'Supplier is edited successfully.',
          icon: 'success'
        }).then(() => {
          self.supplier.name = value.name;
          self.supplier.description = value.description;
          self.supplier.address = value.address;
          self.supplier.telephone = value.telephone;
          self.supplier.website = value.website;

          self.listSuppliers[self.supplierIndex] = self.supplier;
        });
      }
    });
  }

  filter(value) {
    const self = this;
    self.filterValue = value;
    self.emitter.emit(true);
    self.getListSuppliers(1, self.filterValue);
  }

  clearForm() {
    const self = this;
    self.supplier = {};
    self.supplierForm.controls['name'].setValue('');
    self.supplierForm.controls['description'].setValue('');
    self.supplierForm.controls['address'].setValue('');
    self.supplierForm.controls['telephone'].setValue('');
    self.supplierForm.controls['website'].setValue('');
  }
}
