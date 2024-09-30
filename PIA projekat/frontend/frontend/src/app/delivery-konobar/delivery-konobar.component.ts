import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Order } from '../models/order';

@Component({
  selector: 'app-delivery-konobar',
  templateUrl: './delivery-konobar.component.html',
  styleUrls: ['./delivery-konobar.component.css']
})
export class DeliveryKonobarComponent {

  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "konobar"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getOrdersForWaiterRestaurant(this.user.username).subscribe(data=>{
            if(data){
              this.orders = data;
              
            }
          }
        )
      }
    }
    else{
      this.router.navigate(['']);
    }
  }
  user: User = new User(); 
  orders: Order[] = [];

  acceptOrder(order: Order){
    if(order.estimatedTime == ""){
      order.acceptErrorMessage = "Morate izabrati vreme dostave"
      order.declineErrorMessage = ""
    }
    else{
      order.status = "confirmed";
      order.confirmDate = new Date(); 
      order.confirmDate.setHours(order.confirmDate.getHours());
      const estimatedTimeRange = order.estimatedTime.split('-');
      const maxMinutes = parseInt(estimatedTimeRange[1], 10);
      if (!isNaN(maxMinutes)) {
        order.deliveredDate = new Date(order.confirmDate);
        order.deliveredDate.setMinutes(order.deliveredDate.getMinutes() + maxMinutes);
      } else {
        order.deliveredDate = null;
      }
      order.acceptErrorMessage = order.declineErrorMessage = "";
      this.service.changeOrder(order).subscribe(data=>{
        if(data){
          this.orders = this.orders.filter(o => o._id !== order._id);
        }
      })
    }
    
  }

  declineOrder(order: Order){
    if(order.rejectReason == ""){
      order.declineErrorMessage = "Morate uneti razlog odbijanja"
      order.acceptErrorMessage = ""
    }
    else{
      order.status = "rejected";
      order.acceptErrorMessage = order.declineErrorMessage = "";
      this.service.changeOrder(order).subscribe(data=>{
        if(data){
          this.orders = this.orders.filter(o => o._id !== order._id);
        }
      })
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
