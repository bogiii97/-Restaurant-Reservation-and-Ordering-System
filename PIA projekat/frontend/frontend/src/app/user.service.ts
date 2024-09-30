import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/user';
import { Message } from './models/message';
import { Restaurant } from './models/restaurant';
import { WorkingHour } from './models/workingHour';
import { Reservation } from './models/reservations';
import { Order } from './models/order';
import { Layout } from './models/layout';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  loginAdmin(username: string, password: string){
    const data={
      username: username,
      password: password
    }
    return this.http.post<User>("http://localhost:4000/users/loginAdmin", data)
  }

  login(username: string, password: string){
    const data={
      username: username,
      password: password
    }
    return this.http.post<User>("http://localhost:4000/users/login", data)
  }

  getAdminMail(mail: string){
    const data={
      mail: mail
    }
    return this.http.post<User>("http://localhost:4000/users/getAdminMail", data)
  }

  getMail(mail: string){
    const data={
      mail: mail
    }
    return this.http.post<User>("http://localhost:4000/users/getMail", data)
  }

  changePassword(mail: string, password: string){
    const data={
      mail: mail,
      password: password
    }
    return this.http.post<number>("http://localhost:4000/users/changePassword", data)
  }

  register(user: User){
    return this.http.post<Message>("http://localhost:4000/users/register", user)
  }

  changeProfile(user: User){
    return this.http.post<User>("http://localhost:4000/users/changeProfile", user)
  }

  getUsers(type: string){
    const body = { type: type };
    return this.http.post<User[]>("http://localhost:4000/users/getUsers", body);
  }

  getRegistrationRequests(){
    return this.http.get<User[]>("http://localhost:4000/users/getRegistrationRequests");
  }

  setUserStatus(user: User, status: string){
    const data = {
      user: user,
      status: status
    }
    return this.http.post<Message>("http://localhost:4000/users/setUserStatus", data)
  }

  createRestaurant(restaurant: Restaurant){
    return this.http.post<Message>("http://localhost:4000/users/createRestaurant", restaurant);
  }

  getAllRestaurantsNames(){
    return this.http.get<string[]>("http://localhost:4000/users/getAllRestaurantsNames");
  }

  createWaiter(user: User){
    const data = {
      user: user
    }
    return this.http.post<Message>("http://localhost:4000/users/createWaiter", data);
  }

  getWaiterRestaurant(username: string){
    const body = {
      username: username
    }
    return this.http.post<any>("http://localhost:4000/users/getWaiterRestaurant", body);
  }

  getRestaurants(){
    return this.http.get<Restaurant[]>("http://localhost:4000/users/getRestaurants")
  }

  getWaitersNames(waiters: string[]){
    const data = {
      waiters: waiters
    }
    return this.http.post<any>("http://localhost:4000/users/getWaitersNames", data)
  }

  saveRestaurant(restaurantName: string, field: string, array: any[]){
    const data = {
      restaurantName: restaurantName,
      field: field,
      array: array
    }
    return this.http.post<Message>("http://localhost:4000/users/saveRestaurant", data)
  }

  getReservationsDates(){
    return this.http.get<any[]>("http://localhost:4000/users/getReservationsDates");
  }
  
  getReservationsDatesForRestaurant(restaurantName: string){
    const data = {
      restaurantName: restaurantName
    }
    return this.http.post<any[]>("http://localhost:4000/users/getReservationsDatesForRestaurant", data);
  }

  getNumberOfUsers(){
    return this.http.get<any>("http://localhost:4000/users/getNumberOfUsers")
  }

  createReservation(reservation: Reservation){
    return this.http.post<Message>("http://localhost:4000/users/createReservation", reservation);
  }

  createOrder(order: Order){
    return this.http.post<Message>("http://localhost:4000/users/createOrder", order);
  }

  getOrdersForWaiterRestaurant(username: string){
    const data = {
      username: username
    }
    return this.http.post<Order[]>("http://localhost:4000/users/getOrdersForWaiterRestaurant", data)
  }

  changeOrder(order: Order){
    return this.http.post<Message>("http://localhost:4000/users/changeOrder", order);
  }

  changeReservation(reservation: Reservation){
    return this.http.post<Message>("http://localhost:4000/users/changeReservation", reservation);
  }

  getUserOrders(username: string){
    const data = {
      username: username
    }

    return this.http.post<Order[]>("http://localhost:4000/users/getUserOrders", data)
  }

  getUserReservations(username: string){
    const data = {
      username: username
    }
    return this.http.post<Reservation[]>("http://localhost:4000/users/getUserReservations", data)
  }

  getWaiterReservations(username: string){
    const data = {
      username: username
    }
    return this.http.post<Reservation[]>("http://localhost:4000/users/getWaiterReservations", data)
  }

  dropReservation(id: string|null){
    const data = {
      id: id
    }
    
    return this.http.post<Message>("http://localhost:4000/users/dropReservation", data)
  }

  getRestaurantReservations(name: string){
    const data ={
      name: name
    }
    return this.http.post<Reservation[]>("http://localhost:4000/users/getRestaurantReservations", data)
  }

  getLayout(name:string){
    const data = {
      name: name
    }
    return this.http.post<any>("http://localhost:4000/users/getLayout", data)
  }

  notArrived(username: string){
    const data = {
      username: username
    }
    return this.http.post<Message>("http://localhost:4000/users/notArrived", data)
  }
}
