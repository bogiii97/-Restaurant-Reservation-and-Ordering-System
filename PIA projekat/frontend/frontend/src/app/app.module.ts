import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MainPageAdminComponent } from './main-page-admin/main-page-admin.component';
import { MainPageKonobarComponent } from './main-page-konobar/main-page-konobar.component';
import { MainPageGostComponent } from './main-page-gost/main-page-gost.component';
import { LoginPasswordForgetComponent } from './login-password-forget/login-password-forget.component';
import { LoginPasswordForgetAdminComponent } from './login-password-forget-admin/login-password-forget-admin.component';
import { ProfileComponent } from './profile/profile.component';
import { GuestOverviewComponent } from './guest-overview/guest-overview.component';
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import { WaiterOverviewComponent } from './waiter-overview/waiter-overview.component';
import { CreateWaiterComponent } from './create-waiter/create-waiter.component';
import { RestaurantOverviewComponent } from './restaurant-overview/restaurant-overview.component';
import { CreateRestaurantComponent } from './create-restaurant/create-restaurant.component';
import { RestaurantsGostComponent } from './restaurants-gost/restaurants-gost.component';
import { ReservationsGostComponent } from './reservations-gost/reservations-gost.component';
import { DeliveryGostComponent } from './delivery-gost/delivery-gost.component';
import { ReservationsKonobarComponent } from './reservations-konobar/reservations-konobar.component';
import { DeliveryKonobarComponent } from './delivery-konobar/delivery-konobar.component';
import { StatisticsKonobarComponent } from './statistics-konobar/statistics-konobar.component';
import { RestaurantGostComponent } from './restaurant-gost/restaurant-gost.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginAdminComponent,
    RegistrationComponent,
    MainPageComponent,
    MainPageAdminComponent,
    MainPageKonobarComponent,
    MainPageGostComponent,
    LoginPasswordForgetComponent,
    LoginPasswordForgetAdminComponent,
    ProfileComponent,
    GuestOverviewComponent,
    RegistrationRequestsComponent,
    WaiterOverviewComponent,
    CreateWaiterComponent,
    RestaurantOverviewComponent,
    CreateRestaurantComponent,
    RestaurantsGostComponent,
    ReservationsGostComponent,
    DeliveryGostComponent,
    ReservationsKonobarComponent,
    DeliveryKonobarComponent,
    StatisticsKonobarComponent,
    RestaurantGostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
