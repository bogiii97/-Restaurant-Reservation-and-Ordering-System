import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Reservation } from '../models/reservations';

@Component({
  selector: 'app-reservations-gost',
  templateUrl: './reservations-gost.component.html',
  styleUrls: ['./reservations-gost.component.css']
})
export class ReservationsGostComponent {

  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "gost"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getUserReservations(this.user.username).subscribe(data => {
          if (data) {
            console.log(data);
            this.reservations = data.map(reservation => {
              return {
                ...reservation,
                date:  new Date(reservation.date)
              };
            });


            const currentTime = new Date();
            this.reservations.forEach(reservation => {
              if (reservation.status ===   'confirmed' && reservation.date < currentTime) {
                reservation.status = 'archived';
              }
              if((reservation.status === 'confirmed' ||reservation.status === "pending") && (new Date(reservation.date).getTime() - new Date().getTime() > 45 * 60 * 1000)){
                reservation.canDrop = true;
              }
            });
          

            this.reservationsToShow = this.reservations.filter(reservation => reservation.status == this.reservationType);
            this.reservationsToShow.sort((a, b) => {
              return b.date.getTime() - a.date.getTime();
            });
          }
        });
      }
    }
    else{
      this.router.navigate(['']);
    }
  }
  user: User = new User();
  reservations: Reservation[] = [];
  reservationsToShow: Reservation[] = [];
  reservationType: string = "pending";

  typeChange() {
    this.reservationsToShow = this.reservations.filter(reservation => reservation.status === this.reservationType);
    this.reservationsToShow.sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
  }

  dropReservation(id: string | null){
    this.service.dropReservation(id).subscribe(data=>{
      if(data){
        let index = this.reservations.findIndex(res=>res._id == id)
        this.reservations.splice(index, 1);
        this.reservationsToShow = this.reservations.filter(reservation => reservation.status === this.reservationType);
        this.reservationsToShow.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
      }
    })
  }


  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
