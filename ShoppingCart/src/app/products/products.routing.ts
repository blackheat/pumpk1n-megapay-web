import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

export const ProductRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProductsComponent
      }
      // {
      //   path: '/product/:id'
      //   component: ProductDetailComponent
      // }
    ]
  }
];
