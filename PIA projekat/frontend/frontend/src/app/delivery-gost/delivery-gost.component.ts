import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Order } from '../models/order';

@Component({
  selector: 'app-delivery-gost',
  templateUrl: './delivery-gost.component.html',
  styleUrls: ['./delivery-gost.component.css']
})
export class DeliveryGostComponent {

  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if (u != null) {
      this.user = JSON.parse(u);
      if (this.user.type != "gost") {
        this.router.navigate([this.user.type]);
      } else {
        this.service.getUserOrders(this.user.username).subscribe(data => {
          if (data) {
            this.orders = data.map(order => {
              return {
                ...order,
                createdDate: order.createdDate ? new Date(order.createdDate) : null,
                confirmDate: order.confirmDate ? new Date(order.confirmDate) : null,
                deliveredDate: order.deliveredDate ? new Date(order.deliveredDate) : null
              };
            });

            const currentTime = new Date();
            this.orders.forEach(order => {
              if (order.status === 'confirmed' && order.deliveredDate && order.deliveredDate < currentTime) {
                order.status = 'archived';
              }
            });

            this.ordersToShow = this.orders.filter(order => order.status == this.orderType);
            this.ordersToShow.sort((a, b) => {
              if (!a.confirmDate) return 1;
              if (!b.confirmDate) return -1;
              return b.confirmDate.getTime() - a.confirmDate.getTime();
            });
          }
        });
      }
    } else {
      this.router.navigate(['']);
    }
  }
  

  user: User = new User(); 
  orders: Order[] = [];
  ordersToShow: Order[] = [];
  orderType: string = "confirmed";

  typeChange() {
    this.ordersToShow = this.orders.filter(order => order.status === this.orderType);
    
    if (this.orderType === "rejected" || this.orderType === "pending") {
      this.ordersToShow.sort((a, b) => {
        if (!a.createdDate) return 1; 
        if (!b.createdDate) return -1; 
        return b.createdDate.getTime() - a.createdDate.getTime();
      });
    } else if (this.orderType === "confirmed") {
      this.ordersToShow.sort((a, b) => {
        if (!a.confirmDate) return 1; 
        if (!b.confirmDate) return -1; 
        return b.confirmDate.getTime() - a.confirmDate.getTime();
      });
    } else if (this.orderType === "archived") {
      this.ordersToShow.sort((a, b) => {
        if (!a.deliveredDate) return 1; 
        if (!b.deliveredDate) return -1; 
        return b.deliveredDate.getTime() - a.deliveredDate.getTime();
      });
    }
  }
  

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
