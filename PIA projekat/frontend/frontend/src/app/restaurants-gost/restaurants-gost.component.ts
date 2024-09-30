import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Restaurant } from '../models/restaurant';

@Component({
  selector: 'app-restaurants-gost',
  templateUrl: './restaurants-gost.component.html',
  styleUrls: ['./restaurants-gost.component.css']
})
export class RestaurantsGostComponent {
  
  constructor(private router: Router, private service: UserService, private renderer: Renderer2){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "gost"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getRestaurants().subscribe(data=>{
          if(data){
            this.restaurants = data;
            this.restaurantsToShow = JSON.parse(JSON.stringify(this.restaurants));
          }
        })
      }
    }
    else{
      this.router.navigate(['']);
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

  chossenRestaurant: Restaurant | null = null;

  restaurantNavigate(restaurant: Restaurant){
    sessionStorage.setItem("restaurant", JSON.stringify(restaurant));
    this.router.navigate(["gost/restaurants/restaurant"]);
  }


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



  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
