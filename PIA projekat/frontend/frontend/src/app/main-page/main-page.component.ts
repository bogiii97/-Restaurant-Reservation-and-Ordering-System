import { Component, Renderer2 } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Restaurant } from '../models/restaurant';
import { UserService } from '../user.service';
import { Reservation } from '../models/reservations';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(private router: Router, private service: UserService, private renderer: Renderer2){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      this.router.navigate([this.user.type])
    }
    else{
      this.service.getRestaurants().subscribe(data=>{
        if(data){
          this.restaurants = data;
          this.restaurantsToShow = JSON.parse(JSON.stringify(this.restaurants));

          this.numOfRestaurants = this.restaurants.length;
        }
      })

      this.service.getReservationsDates().subscribe(data=>{
        if(data){
          this.reservationsDates = data;
          const now = new Date();
          const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
          this.numOfReservationsDay = data.filter(obj => new Date(obj.date) >= last24Hours).length;
          this.numOfReservationsWeek = data.filter(obj => new Date(obj.date) >= last7Days).length;
          this.numOfReservationsMonth = data.filter(obj => new Date(obj.date) >= last30Days).length;
        }
      })

      this.service.getNumberOfUsers().subscribe(data=>{
        if(data){
          this.numOfUsers = data.numberOfUsers;
        }
      })
    }
  }

  user: User = new User();
  waiterNames: any;
  restaurants: Restaurant[] = [];
  restaurantsToShow: Restaurant[] = [];
  reservationsDates: Date[] = [];
  searchText: string = "";
  sortChoice: string = "";
  typeOfSort: string = "";
  sorted: boolean = false;
  restaurantType: string = "svi";

  numOfRestaurants: number = 0;
  numOfReservationsDay: number = 0;
  numOfReservationsWeek: number = 0;
  numOfReservationsMonth: number = 0;
  numOfUsers: number = 0;

  chossenRestaurant: Restaurant | null = null;



  showWaiters(restaurant: Restaurant){ 
    if(this.chossenRestaurant != null){
      const previousElement = document.getElementById(this.chossenRestaurant.name);
      if (previousElement) {
        this.renderer.setStyle(previousElement, 'background-color', '#9195ff');
        this.renderer.setAttribute(previousElement, 'hidden', 'true');
      }
    }
    this.chossenRestaurant = restaurant;
    this.service.getWaitersNames(restaurant.waiters).subscribe(data=>{
      if(data){
        this.waiterNames = data;
        const currentElement = document.getElementById(restaurant.name);
        if (currentElement) {
          this.renderer.setStyle(currentElement, 'background-color', '#2d308c');
          this.renderer.removeAttribute(currentElement, 'hidden');
        }
      }
    })
  }
  hideWaiters(restaurant: Restaurant){
    this.chossenRestaurant = null;
    const element = document.getElementById(restaurant.name);
    if (element) {
      this.renderer.setStyle(element, 'background-color', '#9195ff');
      this.renderer.setAttribute(element, 'hidden', 'true');
    }
  }

  resetSort(){
    this.sorted = false;
    this.sortChoice = this.typeOfSort = ""
    const searchTextLower = this.searchText.toLowerCase();
    if(this.restaurantType == "svi"){
      this.restaurantsToShow = this.restaurants.filter(restaurant => 
          (restaurant.name.toLowerCase().includes(searchTextLower) ||
           restaurant.address.toLowerCase().includes(searchTextLower))
      );
    }
    else{
      this.restaurantsToShow = this.restaurants.filter(restaurant => 
        restaurant.type == this.restaurantType && 
          (restaurant.name.toLowerCase().includes(searchTextLower) ||
           restaurant.address.toLowerCase().includes(searchTextLower))
      );
    }
  }

  sort(){
    this.restaurantsToShow.sort((a, b) => {
      let comparison = 0;

      if (this.sortChoice === 'name') {
          comparison = a.name.localeCompare(b.name);
      } else if (this.sortChoice === 'address') {
          comparison = a.address.localeCompare(b.address);
      } else if (this.sortChoice === 'type') {
          comparison = a.type.localeCompare(b.type);
      }

      if (this.typeOfSort === 'opadajuće') {
          comparison = comparison * -1;
      }

      return comparison;
  });
  this.sorted = true;
  }

  search() {
    const searchTextLower = this.searchText.toLowerCase();
    if(this.restaurantType == "svi"){
      this.restaurantsToShow = this.restaurants.filter(restaurant => 
          (restaurant.name.toLowerCase().includes(searchTextLower) ||
           restaurant.address.toLowerCase().includes(searchTextLower))
      );
    }
    else{
      this.restaurantsToShow = this.restaurants.filter(restaurant => 
        restaurant.type == this.restaurantType && 
          (restaurant.name.toLowerCase().includes(searchTextLower) ||
           restaurant.address.toLowerCase().includes(searchTextLower))
      );
    }
    
  }

  typeChange(){
    this.searchText = "";
    if(this.restaurantType == "svi"){
      this.restaurantsToShow = this.restaurants;
    }
    else{
      this.restaurantsToShow = this.restaurants.filter(restaurant => restaurant.type == this.restaurantType);
    }
  }
}
