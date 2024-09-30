import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { Restaurant } from '../models/restaurant';
import { WorkingHour } from '../models/workingHour';
import { Table } from '../models/table';
import { Dish } from '../models/dish';
import { Layout } from '../models/layout';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.css']
})
export class CreateRestaurantComponent {
  
  constructor(private router: Router, private service: UserService, private http: HttpClient){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "admin"){
        this.router.navigate([this.user.type]);
      }
      this.loadTables()
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User(); 
  restaurant: Restaurant = new Restaurant();
  info: boolean = true;
  hours: boolean = false;
  tables: boolean = false;
  menu: boolean = false;
  completed: boolean = false;

  day: string = "";
  from: number = 0;
  to: number = 0;

  tableCapacity: number = 0;

  dishName: string = "";
  dishImage: string = "";
  dishPrice: number = 0;
  dishIngredients: string = ""


  infoMessage: string = "";
  hoursMessage: string = "";
  tablesMessage: string = "";
  dishesMessage: string = "";
  pictureError: string = "";
  restaurantPictureError: string = "";

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

  validateRestaurantPicture(event: Event){
    const file = (event.target as HTMLInputElement).files;
    const allowed_file_types = ['image/png', 'image/jpg', 'image/jpeg'];
    const max_size = 3 * 1024 * 1024;
    this.restaurant.picture = "";

    if (file && allowed_file_types.includes(file[0].type) && file[0].size <= max_size) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const image = new Image();
            image.onload = () => {
                if (image.width >= 100 && image.width <= 250 && image.height >= 100 && image.height <= 250) {
                   this.restaurant.picture = base64;
                    this.restaurantPictureError = "";
                } else {      
                    this.restaurantPictureError = "Dimenzija slike mora biti između 100x100px i 250x250px";
                }
            };
            image.onerror = () => {
               this.restaurantPictureError = "Greška pri učitavanju slike";
            };
            image.src = base64;
        };
        reader.readAsDataURL(file[0]);
    } else if (file && !allowed_file_types.includes(file[0].type)) {
        console.log(file[0].type)
        this.restaurantPictureError = "Podržavamo samo jpg i png ekstenzije";
    } else if (file && file[0].size > max_size) {
       this.restaurantPictureError = "Fajl mora biti manji od 3MB";
    } else {
        this.restaurantPictureError = "Greška pri učitavanju slike";
    }
  }

  createRestaurant(){
    if(this.restaurant.menu.length == 0){
      this.dishesMessage = "Morate uneti bar jedno jelo u jelovnik"
    }
    else{
      this.dishesMessage = "";
      this.service.createRestaurant(this.restaurant).subscribe(data =>{
        if(data){
          if(data.message == "Restaurant created successfully"){
            this.completed = true;
            this.menu = false;
          }
          else{
            alert("Greška pri čuvanju restorana")
          }
        } else{
          alert("Nema vraćenih podataka");
        }
      })
    }
  }

  addDish(){
    if(this.dishName == "" || this.dishImage == "" || this.dishPrice == 0 || this.dishIngredients == ""){
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
      dish.ingredients = this.dishIngredients;
      this.restaurant.menu.push(dish);
      
      this.dishesMessage = this.dishName = this.dishImage = this.dishIngredients = "";
      this.dishPrice = 0;

    }
  }

  deleteDish(dishName: string, price: number, ingredients: string){
    this.restaurant.menu = this.restaurant.menu.filter(dish => (dish.dishName !== dishName && dish.ingredients !== ingredients && dish.price != price));
  }

  chossenSchedule: string = "Raspored1" 

  loadTables() {
    this.http.get<Layout>(`../../assets/tables/${this.chossenSchedule}.json`).subscribe(layout => {
      this.tablesMessage = ""
      this.restaurant.layout = layout;
      this.drawLayout(layout);
      
    }, error => {
      this.tablesMessage = 'Error loading tables layout';
      const canvas = document.getElementById('layoutCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
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
  
  
  


  addWorkingHour(){
    if(((this.from > this.to) && this.to != 0) || (this.day == "") || (this.from == this.to) || (this.from < 0 || this.from > 24 || this.to < 0 || this.to > 24 )){
      this.hoursMessage = "Uneto radno vreme nije validno"
    }
    else{
      let h = new WorkingHour();
      h.day = this.day;
      h.openingTime = this.from;
      h.closingTime = this.to;
      this.restaurant.workingHours.push(h);
      this.day = this.hoursMessage = "";
      this.from = this.to = 0;
    }
  }

  deleteWorkingHour(day: string, from: number, to: number){
      this.restaurant.workingHours = this.restaurant.workingHours.filter(hour => (hour.day !== day) || ((hour.day == day) && (hour.openingTime != from || hour.closingTime != to)));
  }


  next(){
    if(this.restaurant.address == "" || this.restaurant.contactPerson == "" || this.restaurant.description == "" || this.restaurant.name == "" || this.restaurant.type == "" || this.restaurant.picture == ""){
      this.infoMessage = "Morate popuniti sva polja"
    }
    else{
      this.infoMessage = "";
      this.info = false;
      this.hours = true;
    
    }
  }

  prev1(){
    this.hours = false;
    this.info = true;
  }

  next1(){
    if(this.restaurant.workingHours.length == 0){
      this.hoursMessage = "Morate uneti bar jedno radno vreme za restoran"
    }
    else{
      this.hoursMessage = "";
      this.tables = true;
      this.loadTables();
      this.hours = false;
    }
  }

  prev2(){
    this.hours = true;
    this.tables = false;
  }

  next2(){
    if(this.tablesMessage != ""){
      this.tablesMessage = "Nije izabrana validna konfiguracija"
    }
    else{
      this.menu = true;
      this.tables = false;
    }
  }

  prev3(){
    this.tables = true;
    this.loadTables();
    this.menu = false;
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
