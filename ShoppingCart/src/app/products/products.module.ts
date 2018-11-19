import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductRoutes } from './products.routing';

import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './products.component';
import { ProductInfoComponent } from './product-info/product-info.component';

@NgModule({
  imports: [
    RouterModule.forChild(ProductRoutes),
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    ProductsComponent,
    ProductInfoComponent
  ],
  exports: []
})
export class ProductsModule { }
