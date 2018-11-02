import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductInfoComponent } from './product-info/product-info.component';

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent
      },
      {
        path: '/:id',
        component: ProductInfoComponent
      }
    ]
  }
];
