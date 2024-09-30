import { Component } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Restaurant } from '../models/restaurant';
import { WorkingHour } from '../models/workingHour';
import { Table } from '../models/table';
import { Dish } from '../models/dish';
import { Layout } from '../models/layout';

@Component({
  selector: 'app-restaurant-overview',
  templateUrl: './restaurant-overview.component.html',
  styleUrls: ['./restaurant-overview.component.css']
})
export class RestaurantOverviewComponent {
  
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "admin"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getRestaurants().subscribe(data => {
          if(data){
            this.restaurants = data;
            this.restaurantsToShow = this.restaurants.filter(restaurant => restaurant.type == this.restaurantType);
          }
        })
      }
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User(); 
  restaurants: Restaurant[] = []
  restaurantsToShow: Restaurant[] = [];
  completedMessage: string = "";
  searchText: string = "";
  restaurantType: string = "domaćaKuhinja";

  showRestaurants: boolean = true;
  showWaiters: boolean = false;
  showMenu: boolean = false;
  showTables: boolean = false;
  showWorkingHours: boolean = false;

  restaurantToShow: Restaurant = new Restaurant();

  waiterNames: any;
  
  back(){
    this.showWaiters = this.showMenu = this.showTables = this.showWorkingHours = false;
    this.showRestaurants = true;
    this.waiterNames = null;
  }

  day: string = "";
  from: number = 0;
  to: number = 0;
  hoursMessage: string = "";
  workingHoursToShow: WorkingHour[] = [];
  

  saveWorkingHours(){
    this.restaurantToShow.workingHours = this.workingHoursToShow;
    this.service.saveRestaurant(this.restaurantToShow.name, "workingHours", this.workingHoursToShow).subscribe(data=>{
      if(data){
        let restaurant = this.restaurants.find(r => r.name === this.restaurantToShow.name);
        if(restaurant) restaurant.workingHours = this.workingHoursToShow;
        this.completedMessage = 'Uspešno ažurirano';
            setTimeout(() => {
                this.completedMessage = '';
            }, 3000);
      }
    })
  }

  addWorkingHour(){
    if(((this.from > this.to) && this.to != 0) || (this.day == "") || (this.from == this.to) || (this.from < 0 || this.from > 24 || this.to < 0 || this.to > 24 )){
      this.hoursMessage = "Uneto radno vreme nije validno"
    }
    else{
      let h = new WorkingHour();
      h.day = this.day;
      h.openingTime = this.from;
      h.closingTime = this.to;
      this.workingHoursToShow.push(h);
      this.day = this.hoursMessage = "";
      this.from = this.to = 0;
    }
  }

  deleteWorkingHour(day: string, from: number, to: number){
      this.workingHoursToShow = this.workingHoursToShow.filter(hour => (hour.day !== day) || ((hour.day == day) && (hour.openingTime != from || hour.closingTime != to)));
  }

  workingHours(restaurant: Restaurant){
    this.day = this.hoursMessage = "";
    this.from = this.to = 0;
    this.restaurantToShow = restaurant;
    this.workingHoursToShow = restaurant.workingHours;
    this.showWorkingHours = true;
    this.showRestaurants = false;
  }




  saveMenu(){
    this.restaurantToShow.menu = this.dishesToShow;
    this.service.saveRestaurant(this.restaurantToShow.name, "menu", this.dishesToShow).subscribe(data=>{
      if(data){
        let restaurant = this.restaurants.find(r => r.name === this.restaurantToShow.name);
        if(restaurant) restaurant.menu = this.dishesToShow;
        this.completedMessage = 'Uspešno ažurirano';
            setTimeout(() => {
                this.completedMessage = '';
            }, 3000);
      }
    })
  }
  


  tables(restaurant: Restaurant){
    this.showTables = true;
    this.showRestaurants = false;
    setTimeout(() => {
      this.drawLayout(restaurant.layout);
    }, 0);
  }

  drawLayout(layout: Layout) {
    const canvas = document.getElementById('layoutCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) return;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const restaurantWidth = 350;
    const restaurantHeight = 300;
  
    const offsetX = (canvas.width - restaurantWidth) / 2;
    const offsetY = (canvas.height - restaurantHeight) / 2;
  
    ctx.strokeStyle = 'black';
    ctx.strokeRect(offsetX, offsetY, restaurantWidth, restaurantHeight);
  
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      offsetX + layout.kitchen.x,
      offsetY + layout.kitchen.y,
      layout.kitchen.width,
      layout.kitchen.height
    );
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Kuhinja',
      offsetX + layout.kitchen.x + layout.kitchen.width / 2,
      offsetY + layout.kitchen.y + layout.kitchen.height / 2 + 6
    );
  
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      offsetX + layout.toilet.x,
      offsetY + layout.toilet.y,
      layout.toilet.width,
      layout.toilet.height
    );
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'WC',
      offsetX + layout.toilet.x + layout.toilet.width / 2,
      offsetY + layout.toilet.y + layout.toilet.height / 2 + 6
    );
  
    layout.tables.forEach((table, index) => {
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(
        offsetX + table.x,
        offsetY + table.y,
        table.radius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.closePath();
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Sto${index + 1}`,
        offsetX + table.x,
        offsetY + table.y + 4
      );
    });
  }
  

  validateDishPicture(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    const allowed_file_types = ['image/png', 'image/jpg', 'image/jpeg'];
    const max_size = 3 * 1024 * 1024;     
    if (file && allowed_file_types.includes(file[0].type) && file[0].size <= max_size) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const image = new Image();
            image.onload = () => {
                if (image.width >= 100 && image.width <= 200 && image.height >= 100 && image.height <= 200) {
                    this.dishImage = base64;
                    this.pictureError = "";
                } else {      
                    this.pictureError = "Dimenzija slike mora biti između 100x100px i 200x200px";
                }
            };
            image.onerror = () => {
               this.pictureError = "Greška pri učitavanju slike";
            };
            image.src = base64;
        };
        reader.readAsDataURL(file[0]);
    } else if (file && !allowed_file_types.includes(file[0].type)) {
        console.log(file[0].type)
        this.pictureError = "Podržavamo samo jpg i png ekstenzije";
    } else if (file && file[0].size > max_size) {
       this.pictureError = "Fajl mora biti manji od 3MB";
    } else {
        this.pictureError = "Greška pri učitavanju slike";
    }
  }
  
  addDish(){
    if(this.dishName == "" || this.dishImage == "" || this.dishPrice == 0 || this.ingredients == ""){
      this.dishesMessage = "Morate prvo popuniti sva polja"
    }
    else if(this.pictureError != ""){
      this.dishesMessage = "Morate uneti sliku u ispravnom formatu"
    }
    else{
      let dish = new Dish();
      dish.dishName = this.dishName;
      dish.image = this.dishImage;
      dish.price = this.dishPrice;
      dish.ingredients = this.ingredients;
      this.dishesToShow.push(dish);
      this.dishesMessage = this.dishName = this.dishImage = this.ingredients = "";
      this.dishPrice = 0;
    }
  }

  deleteDish(dishName: string, price: number, ingredients: string){
    this.dishesToShow = this.dishesToShow.filter(dish => (dish.dishName !== dishName && dish.ingredients !== ingredients && dish.price != price));
  }

  dishesMessage: string = "";
  dishesToShow: Dish[] = [];
  dishName: string = "";
  ingredients: string = "";
  dishPrice: number = 0;
  dishImage: string = "";
  pictureError: string = "";


  menu(restaurant: Restaurant){
    this.dishName = this.ingredients = this.dishImage = this.pictureError = this.dishesMessage = "";
    this.dishPrice = 0;
    this.restaurantToShow = restaurant;
    this.dishesToShow = JSON.parse(JSON.stringify(restaurant.menu));
    this.showMenu = true;
    this.showRestaurants = false;
  }

  waiters(restaurant: Restaurant){  
    this.service.getWaitersNames(restaurant.waiters).subscribe(data=>{
      if(data){
        this.waiterNames = data;
      }
    })
    this.showWaiters = true;
    this.showRestaurants = false;
  }

  search() {
    const searchTextLower = this.searchText.toLowerCase();
    this.restaurantsToShow = this.restaurants.filter(restaurant => 
      restaurant.type == this.restaurantType && 
        (restaurant.name.toLowerCase().includes(searchTextLower))
    );
  }

  typeChange(){
    this.searchText = "";
    this.restaurantsToShow = this.restaurants.filter(restaurant => restaurant.type == this.restaurantType);
  }


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
