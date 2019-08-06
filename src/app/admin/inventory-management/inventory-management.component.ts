import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { MAX_PRODUCTS_ROW_PER_PAGE } from 'src/app/shared/constants';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/services/spinner.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { ProductService } from 'src/app/services/product.service';
import { SupplierService } from 'src/app/services/supplier.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent implements OnInit {
  @ViewChild('addInventory') public modal: NgbModalRef;
  listInventories = [];
  listProducts = [];
  listSuppliers = [];
  inventoryGroup = [];
  inventoryAllGroup = [];
  currentPage = 1;
  totalPage = 1;
  customerId = '';
  currentExportPage = 1;
  totalExportPage = 1;

  closeResult: string;
  inventory;
  inventoryIndex;
  inventoryForm: FormGroup;
  filterForm: FormGroup;
  filterValue = {
    productName: '',
    supplierName: ''
  };
  handling = [];
  emitter: EventEmitter<boolean>;
  selectedProduct = null;
  selectedSupplier = null;
  constructor(
    private service: InventoryService,
    private modalService: NgbModal,
    private spinnerService: SpinnerService,
    private productService: ProductService,
    private supplierService: SupplierService
  ) { }

  ngOnInit() {
    const self = this;
    self.emitter = self.spinnerService.listener;
    self.filterForm = new FormGroup({
      productName: new FormControl(''),
      supplierName: new FormControl(''),
    });
    self.inventoryForm = new FormGroup({
      productUniqueIdentifier: new FormControl('', Validators.required),
    });
    self.getListInventories(1, self.filterValue);
    self.getListProducts();
    self.getListSuppliers();
  }

  getListInventories(page, filter?, productId?, supplierId?) {
    const self = this;
    self.emitter.emit(true);
    self.service
      .getSearchFilter(1, 100000000, {
        productName: filter && filter.productName ? filter.productName.trim() : '',
        productId: productId ? productId : -1,
        supplierName: filter && filter.supplierName ? filter.supplierName.trim() : '',
        supplierId: supplierId ? supplierId : -1,
      })
      .subscribe((v: any) => {
        self.emitter.emit(false);
        if (v.responseType === 'success') {
          self.inventoryAllGroup = [...self.handleInventoryGroup(v.data)];
          if (self.inventoryAllGroup.length > 0) {
            self.goToPage(page, 'list');
            self.currentPage = page;
            self.totalPage = Math.floor((self.inventoryAllGroup.length - 1) / MAX_PRODUCTS_ROW_PER_PAGE) + 1;
          } else {
            self.inventoryGroup = [];
          }
        }
      });
  }

  getListProducts() {
    const self = this;
    self.emitter.emit(true);
    self.productService.getSearchFilter(1, 1000000).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        self.listProducts = v.data;
      }
    });
  }

  getListSuppliers() {
    const self = this;
    self.emitter.emit(true);
    self.supplierService.getSearchFilter(1, 1000000).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        self.listSuppliers = v.data;
      }
    });
  }

  goToPage(value, mode) {
    const self = this;
    switch (mode) {
      case 'list': {
        if (value < 1 || value > self.totalPage) {
          return;
        }
        const start = (value - 1) * MAX_PRODUCTS_ROW_PER_PAGE;
        const end = start + MAX_PRODUCTS_ROW_PER_PAGE >= self.inventoryAllGroup.length ?
          self.inventoryAllGroup.length : start + MAX_PRODUCTS_ROW_PER_PAGE;
        self.inventoryGroup = self.inventoryAllGroup.slice(start, end);
        self.currentPage = value;
        break;
      }
      case 'export': {
        if (value < 1 || value > self.totalExportPage) {
          return;
        }
        const start = (value - 1) * MAX_PRODUCTS_ROW_PER_PAGE;
        const end = start + MAX_PRODUCTS_ROW_PER_PAGE >= self.inventory.productUniqueIdentifiers.length ?
          self.inventory.productUniqueIdentifiers.length : start + MAX_PRODUCTS_ROW_PER_PAGE;
        self.inventory.displaying = self.inventory.productUniqueIdentifiers.slice(start, end);
        self.currentExportPage = value;
        break;
      }
      default:
        return;
    }

  }

  open(content) {
    const self = this;
    self.clearForm();
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


  getInventoryDetail(inventory, index) {
    const self = this;
    const filter = {
      productId: inventory.productDetails.id,
      supplierId: inventory.supplierDetails.id
    }
    self.inventoryIndex = index;
    self.customerId = '';
    self.service.getSearchFilter(1, 1000000, filter).subscribe((v: any) => {
      if (v.responseType === 'success') {
        self.inventory.productDetails = v.data[0].productDetails;
        self.inventory.supplierDetails = v.data[0].supplierDetails;
        self.inventory.productUniqueIdentifiers = [];
        let i = 1;
        v.data.forEach(val => {
          self.inventory.productUniqueIdentifiers.push({
            index: i,
            id: val.id,
            productUniqueIdentifier: val.productUniqueIdentifier,
            exportedDate: val.exportedDate,
            importedDate: val.importedDate,
            isExported: (new Date(val.exportedDate)) >= (new Date(val.importedDate))
          });
          i++;
        });
        self.currentExportPage = 1;
        self.totalExportPage = Math.floor((self.inventory.productUniqueIdentifiers.length - 1) / MAX_PRODUCTS_ROW_PER_PAGE) + 1;
        self.goToPage(1, 'export');
      }
    });
  }

  validate() {
    const self = this;
    const formControl = self.inventoryForm.controls;

    const errors = [
      self.selectedProduct === null ? 'Product is required.' : null,
      self.selectedSupplier === null ? 'Supplier is required.' : null,
      !formControl.productUniqueIdentifier.value.trim() ||
        !formControl.productUniqueIdentifier.value ? 'Product\'s unique identifier is required.' : null,
    ];

    return errors.filter((e) => e != null).join('\n');
  }

  onSubmit(value) {
    const self = this;

    if (self.validate() !== '') {
      swal({
        title: 'Failed to edit inventory',
        text: self.validate(),
        icon: 'error'
      });
      self.open(self.modal);
      return;
    }

    self.service.importInventory(self.selectedProduct, self.selectedSupplier, value).subscribe((v: any) => {
      self.emitter.emit(false);
      if (v.responseType === 'success') {
        swal({
          title: 'Congratulations',
          text: 'Inventory is added successfully.',
          icon: 'success'
        }).then(() => {
          self.getListInventories(self.currentPage, self.filterValue);
        });
      }
    });

  }

  filter(value) {
    const self = this;
    self.filterValue.productName = value.productName || '';
    self.filterValue.supplierName = value.supplierName || '';
    self.emitter.emit(true);
    self.getListInventories(1, self.filterValue);
  }

  clearForm() {
    const self = this;
    self.inventory = {};
    self.inventoryForm.controls['productUniqueIdentifier'].setValue('');
  }

  handleInventoryGroup(inventories) {
    this.handling = [];
    return inventories.filter((a) => {
      const key = a.productId + '|' + a.supplierId;
      if (!this.handling[key]) {
        this.handling[key] = true;
        return true;
      }
    }, Object.create(null));
  }

  onProductChange(value) {
    const self = this;
    const index = self.listProducts.findIndex(v => v.id.toString() === value);
    self.selectedProduct = index === -1 ? null : self.listProducts[index];
  }

  onSupplierChange(value) {
    const self = this;
    const index = self.listSuppliers.findIndex(v => v.id.toString() === value);
    self.selectedSupplier = index === -1 ? null : self.listSuppliers[index];
  }

  onExport(item) {
    const self = this;
    item.customerId = self.customerId || null;
    swal({
      title: 'Warning',
      text: 'Are you sure to export this item?',
      icon: 'info',
      buttons: ['No', 'Yes']
    }).then((result) => {
      if (result) {
        self.service.exportInventory(item).subscribe((v: any) => {
          if (v.responseType === 'success') {
            swal({
              title: 'Congratulations',
              text: 'Inventory is added successfully.',
              icon: 'success'
            }).then(() => {
              self.getInventoryDetail(self.inventoryGroup[self.inventoryIndex], self.inventoryIndex);
            });
          }
        });
      }
    });
  }

  getStatus(isExported) {
    return isExported ? (new Date()).toDateString() : 'Available';
  }
}
