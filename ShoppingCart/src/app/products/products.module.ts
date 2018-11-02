import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProductRoutes } from './products.routing';

import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './products.component';

@NgModule({
  imports: [
    RouterModule.forChild(ProductRoutes),
    CommonModule,
    SharedModule
  ],
  declarations: [
    ProductsComponent
  ],
  exports: []
})
export class ProductsModule { }
