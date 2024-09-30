import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Restaurant } from '../models/restaurant';
import { Reservation } from '../models/reservations';
import { DishOrder } from '../models/dishOrder';
import { Dish } from '../models/dish';
import { Order } from '../models/order';

@Component({
  selector: 'app-restaurant-gost',
  templateUrl: './restaurant-gost.component.html',
  styleUrls: ['./restaurant-gost.component.css']
})
export class RestaurantGostComponent {

  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "gost"){
        this.router.navigate([this.user.type]);
      }
      else{
        let temp = sessionStorage.getItem("restaurant");
        if(temp != null){
          this.restaurant = JSON.parse(temp);

          this.restaurant.layout.tables.forEach(elem => {
            if(elem.maxSeats>this.maximumTableCapacity){
              this.maximumTableCapacity = elem.maxSeats;
            }
          })

          this.service.getWaitersNames(this.restaurant.waiters).subscribe(data=>{
            if(data){
              this.waiterNames = data;
            }
          })

          this.service.getReservationsDatesForRestaurant(this.restaurant.name).subscribe(data=>{
            if(data){
              this.reservationsForRestaurant = data;
            }
          })

        }else{
          this.router.navigate(["gost/restaurants"]);
        }
      }
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User();
  restaurant: Restaurant = new Restaurant();
  waiterNames: any;
  reservationsForRestaurant: any[] = [];
  maximumTableCapacity: number = 0;

  numOfPeople: number = 0;
  date: Date | null = null;
  additionalRequest: string = "";

  reservationMessage: string = "";
  orderMessage: string = "";
  completedMessage: string = "";
  completedOrderMessage: string = "";

  dishesInBasket: DishOrder[] = [];
  address: string = "";
  phoneNumber: string = "";
  totalPrice: number = 0;
  
  createOrder(){
    if(this.address == "" || this.phoneNumber == ""){
      this.orderMessage = "Morate popuniti oba polja";
      return;
    }
    let order = new Order();
    order.orderItems = this.dishesInBasket;
    order.restaurant = this.restaurant.name;
    order.username = this.user.username;
    order.firstname = this.user.firstname;
    order.lastname = this.user.lastname;
    order.totalPrice = this.totalPrice;
    order.status = "pending"
    order.deliveryAddress = this.address;
    order.phoneNumber = this.phoneNumber;
    order.createdDate = new Date();
    
    //order.createdDate.setHours(order.createdDate.getHours()+2);
    order.createdDate.setHours(order.createdDate.getHours());


    this.service.createOrder(order).subscribe(data =>{
      if(data){
        this.orderMessage = "";   
        this.address = "";
        this.phoneNumber = "";
        this.dishesInBasket = [];
        this.restaurant.menu.forEach(dish => dish.inBasket = false)
        this.totalPrice = 0;

        this.completedOrderMessage = "Uspešno izvršeno"
        setTimeout(() => {
            this.completedOrderMessage = "";
        }, 3000);
      }
    })
  }

  addDish(d: Dish){
    d.inBasket = true;
    let dish = new DishOrder();
    dish.name= d.dishName;
    dish.price = d.price;
    dish.quantity = 1;
    this.totalPrice += dish.price;
    this.dishesInBasket.push(dish);
  }

  incrementDish(name: string){
    let dish = this.dishesInBasket.find(d => d.name == name);
    if(dish) {
      dish.quantity += 1;
      this.totalPrice += dish.price;
    }
  }

  deleteDish(d: Dish){
    d.inBasket = false;
    let dishIndex = this.dishesInBasket.findIndex(dish => dish.name == d.dishName);
    if(dishIndex !== -1){
        this.totalPrice -= this.dishesInBasket[dishIndex].quantity * this.dishesInBasket[dishIndex].price;
        this.dishesInBasket.splice(dishIndex, 1);
    } 
  }

  decrementDish(name: string){
    let dishIndex = this.dishesInBasket.findIndex(d => d.name == name);
    if (dishIndex !== -1) {
        let dish = this.dishesInBasket[dishIndex];
        dish.quantity -= 1;
        this.totalPrice -= dish.price;
        if (dish.quantity == 0) {
            this.dishesInBasket.splice(dishIndex, 1);
            let index = this.restaurant.menu.findIndex(d => d.dishName == name);
            this.restaurant.menu[index].inBasket = false;
        }
    }
  }

  makeReservation() {

    if (this.date == null || this.numOfPeople == 0) {
      this.reservationMessage = "Morate popuniti sva polja označena sa *";
      return;
    }

    if(this.numOfPeople > this.maximumTableCapacity){
      this.reservationMessage = "Nema stola koji podržava toliko ljudi";
      return;
    }
    

    const currentDate = new Date(); 
    const selectedDate1 = new Date(this.date); 
    if (selectedDate1 < currentDate) {
      this.reservationMessage = "Ne možete izabrati datum koji je u prošlosti.";
      return; 
    }


    const selectedDate = new Date(this.date);
    const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); 
    const selectedHour = selectedDate.getHours();


    const daysMap: { [key: string]: string } = {
      'Ponedeljak': 'monday',
      'Utorak': 'tuesday',
      'Sreda': 'wednesday',
      'Četvrtak': 'thursday',
      'Petak': 'friday',
      'Subota': 'saturday',
      'Nedelja': 'sunday'
    };

    const workingHoursCopy = this.restaurant.workingHours.map(wh => {
      return {
        day: daysMap[wh.day] || wh.day.toLowerCase(),
        openingTime: wh.openingTime,
        closingTime: wh.closingTime
      };
    });

    const workingHoursForSelectedDay = workingHoursCopy.find((wh) => wh.day === selectedDay);
    if (workingHoursForSelectedDay) {
      if (selectedHour < workingHoursForSelectedDay.openingTime || selectedHour >= workingHoursForSelectedDay.closingTime) {
        this.reservationMessage = "Restoran ne radi u izabrano vreme.";
        return; 
      }
    } else {
      this.reservationMessage = "Restoran ne radi tog dana.";
      return;
    }
    

    
    const reservationStart = new Date(this.date).getTime();
    const reservationEnd = reservationStart + 3 * 60 * 60 * 1000; // Dodati 3 sata u milisekundama

    
    const suitableTables = this.restaurant.layout.tables.filter(table => table.maxSeats >= this.numOfPeople);

    
    const isTableAvailable = suitableTables.some(table => {
      const reservationsForTable = this.reservationsForRestaurant.filter(reservation => reservation.table === table.tableName);

      return reservationsForTable.every(reservation => {
        const existingReservationStart = new Date(reservation.date).getTime();
        const existingReservationEnd = existingReservationStart + 3 * 60 * 60 * 1000;

        return reservationEnd <= existingReservationStart || reservationStart >= existingReservationEnd;
      });
    });

    if (!isTableAvailable) {
      this.reservationMessage = "Nema dostupnih stolova u traženom terminu.";
      return;
    }


    let reservation = new Reservation();
    reservation.additionalRequest = this.additionalRequest;
    reservation.date = this.date;
    reservation.numberOfPeople = this.numOfPeople;
    reservation.restaurant = this.restaurant.name;
    reservation.restaurantAddress = this.restaurant.address;
    reservation.username = this.user.username;
    reservation.firstname = this.user.firstname;
    reservation.lastname = this.user.lastname;
    reservation.phoneNumber = this.user.phone;
    reservation.status = "pending"
    reservation.waiter = reservation.table = "";
    reservation.extraHour = false;

    this.service.createReservation(reservation).subscribe(data => {
      if(data){
        this.reservationMessage = "";
        this.date = null;
        this.additionalRequest = "";
        this.numOfPeople = 0;
        this.completedMessage = "Uspešno izvršeno"
        setTimeout(() => {
            this.completedMessage = "";
        }, 3000);
      }
    })
}


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
