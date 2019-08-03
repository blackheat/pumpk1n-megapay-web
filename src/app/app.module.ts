import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule, RoutingComponent } from './app.routing';
import { HomeComponent } from './home/home.component';
import { HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { OwlModule } from 'ngx-owl-carousel';
import { ProductsModule } from './products/products.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ProductManagementComponent } from './admin/product-management/product-management.component';
import { AccountManagementComponent } from './admin/account-management/account-management.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { SupplierManagementComponent } from './admin/supplier-management/supplier-management.component';
@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    HomeComponent,
    NavbarComponent,
    ProductManagementComponent,
    AccountManagementComponent,
    OrderManagementComponent,
    SupplierManagementComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    AngularFontAwesomeModule,
    OwlModule,
    SharedModule,
    RouterModule
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
