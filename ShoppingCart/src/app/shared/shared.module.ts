import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';
import { FilterFieldsComponent } from './filter-fields/filter-fields.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ErrorInterceptor } from './helper/error.interceptor';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TruncatePipe } from './custom-pipe/truncate.pipe';
import { PaginationComponent } from './pagination/pagination.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxSpinnerModule
  ],
  declarations: [
    ProductCardComponent,
    FilterFieldsComponent,
    LoadingSpinnerComponent,
    TruncatePipe,
    PaginationComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [
    ProductCardComponent,
    FilterFieldsComponent,
    LoadingSpinnerComponent,
    TruncatePipe,
    PaginationComponent
  ]
})
export class SharedModule { }
