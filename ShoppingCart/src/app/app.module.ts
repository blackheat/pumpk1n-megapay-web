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
import { CartComponent } from './cart/cart.component';
import { AboutComponent } from './about/about.component';
import { UserComponent } from './user/user.component';
@NgModule({
  declarations: [
    AppComponent,
    RoutingComponent,
    HomeComponent,
    NavbarComponent,
    CartComponent,
    AboutComponent,
    UserComponent
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
    SharedModule
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
