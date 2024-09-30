import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainPageKonobarComponent } from './main-page-konobar/main-page-konobar.component';
import { MainPageGostComponent } from './main-page-gost/main-page-gost.component';
import { MainPageAdminComponent } from './main-page-admin/main-page-admin.component';
import { LoginPasswordForgetAdminComponent } from './login-password-forget-admin/login-password-forget-admin.component';
import { LoginPasswordForgetComponent } from './login-password-forget/login-password-forget.component';
import { ProfileComponent } from './profile/profile.component';
import { GuestOverviewComponent } from './guest-overview/guest-overview.component';
import { RegistrationRequestsComponent } from './registration-requests/registration-requests.component';
import { WaiterOverviewComponent } from './waiter-overview/waiter-overview.component';
import { RestaurantOverviewComponent } from './restaurant-overview/restaurant-overview.component';
import { CreateRestaurantComponent } from './create-restaurant/create-restaurant.component';
import { CreateWaiterComponent } from './create-waiter/create-waiter.component';
import { RestaurantsGostComponent } from './restaurants-gost/restaurants-gost.component';
import { ReservationsGostComponent } from './reservations-gost/reservations-gost.component';
import { DeliveryGostComponent } from './delivery-gost/delivery-gost.component';
import { ReservationsKonobarComponent } from './reservations-konobar/reservations-konobar.component';
import { DeliveryKonobarComponent } from './delivery-konobar/delivery-konobar.component';
import { StatisticsKonobarComponent } from './statistics-konobar/statistics-konobar.component';
import { RestaurantGostComponent } from './restaurant-gost/restaurant-gost.component';

const routes: Routes = [
  {path: "", component: MainPageComponent},
  {path: "login", component: LoginComponent},
  {path: "loginAdmin", component: LoginAdminComponent},
  {path: "registration", component: RegistrationComponent},
  {path: "konobar", component: MainPageKonobarComponent},
  {path: "gost", component:MainPageGostComponent},
  {path: "admin", component: MainPageAdminComponent},
  {path: "loginAdmin/passwordForget", component: LoginPasswordForgetAdminComponent},
  {path: "login/passwordForget", component: LoginPasswordForgetComponent},
  {path: "profile", component:ProfileComponent},
  {path: "admin/guestOverview", component: GuestOverviewComponent},
  {path: "admin/registrationRequests", component: RegistrationRequestsComponent},
  {path: "admin/waiterOverview", component: WaiterOverviewComponent},
  {path: "admin/createWaiter", component: CreateWaiterComponent},
  {path: "admin/restaurantOverview", component:RestaurantOverviewComponent},
  {path: "admin/createRestaurant", component:CreateRestaurantComponent},
  {path: "gost/restaurants", component:RestaurantsGostComponent},
  {path: "gost/restaurants/restaurant", component: RestaurantGostComponent},
  {path: "gost/reservations", component: ReservationsGostComponent},
  {path: "gost/foodDelivery", component: DeliveryGostComponent},
  {path: "konobar/reservations", component: ReservationsKonobarComponent},
  {path: "konobar/foodDelivery", component: DeliveryKonobarComponent},
  {path: "konobar/statistics", component:StatisticsKonobarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
