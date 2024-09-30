import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Reservation } from '../models/reservations';
import { Layout } from '../models/layout';

@Component({
  selector: 'app-reservations-konobar',
  templateUrl: './reservations-konobar.component.html',
  styleUrls: ['./reservations-konobar.component.css']
})
export class ReservationsKonobarComponent {

  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "konobar"){
        this.router.navigate([this.user.type]);
      }else{
        this.service.getLayout(this.user.restaurant).subscribe(data=>{
          if(data){  
            this.layout = data.layout;
            setTimeout(() => {
              this.drawLayout(this.layout);
            }, 0);
            this.service.getRestaurantReservations(this.user.restaurant).subscribe(data=>{
              if(data){
                this.reservations = data.map(reservation => {
                  return {
                    ...reservation,
                    date: new Date(reservation.date) 
                  };
                });
                const currentTime = new Date().getTime();
                this.myConfirmedReservations = this.reservations
                        .filter(obj => obj.status == "confirmed" && obj.waiter == this.user.username && (obj.arrived=="" || (obj.arrived=="Da" && obj.extraHour==false && currentTime <= new Date(obj.date).getTime() + 3 * 60 * 60 * 1000)))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                this.allPendingReservations = this.reservations.filter(obj => obj.status == "pending")
                if(this.allPendingReservations.length>0){
                  this.currentReservation = this.allPendingReservations[this.index]
                  this.setFreeTables();
                }
              }
            })
          }
        })
      }
    }
    else{
      this.router.navigate(['']);
    }
  }
  user: User = new User(); 
  reservations: Reservation[] = []
  currentReservation: Reservation = new Reservation()
  index: number = 0;
  myConfirmedReservations: Reservation[] = []
  allPendingReservations: Reservation[] = []
  layout: Layout = new Layout()

  flag: boolean = true;

  rejectReason: string = ""
  rejectMessage: string = "";
  acceptMessage: string = "";

  freeTables: string[] = []
  selectedTable: string = ""

  changeWindow(flag: boolean){
    if(flag == this.flag) return;
    this.flag = flag;
    if(flag){
      setTimeout(() => {
        this.drawLayout(this.layout);
      }, 0);
    }
  }

  setFreeTables() {
    this.freeTables = [""];

    const reservationStartTime = new Date(this.currentReservation.date).getTime();
    const reservationEndTime = reservationStartTime + (this.currentReservation.extraHour ? 4 : 3) * 60 * 60 * 1000;

    this.layout.tables.forEach(table => {
        if (table.maxSeats < this.currentReservation.numberOfPeople) {
            return; 
        }
        let isTableFree = true;

        this.reservations.forEach(reservation => {
            if (reservation.status === 'confirmed' && reservation.arrived !== "Ne" && reservation.table === table.tableName) {
                const confirmedStartTime = new Date(reservation.date).getTime();
                const confirmedEndTime = confirmedStartTime + (reservation.extraHour ? 4 : 3) * 60 * 60 * 1000;

                if ((reservationStartTime < confirmedEndTime && reservationEndTime > confirmedStartTime) ||
                    (confirmedStartTime < reservationEndTime && confirmedEndTime > reservationStartTime)) {
                    isTableFree = false;
                }
            }
        });

        if (isTableFree) {
            this.freeTables.push(table.tableName);
        }
    });
    this.drawLayout(this.layout);
  }

  arrival(reservation: Reservation, arrived: boolean){
    if(arrived){
      reservation.arrived = "Da";
      const currentTime = new Date().getTime();
      if(currentTime > new Date(reservation.date).getTime() + 3 * 60 * 60 * 1000){
        let index = this.myConfirmedReservations.findIndex(res => res._id == reservation._id)
        this.myConfirmedReservations.splice(index, 1);
      }
    }
    else{
      reservation.arrived = "Ne"
      let index = this.myConfirmedReservations.findIndex(res => res._id == reservation._id)
      this.myConfirmedReservations.splice(index, 1);
      this.service.notArrived(reservation.username).subscribe(data=>{
        if(data){

        }
      })
    }
    this.service.changeReservation(reservation).subscribe(data=>{

    })
  }

  isHalfHourPast(reservationDate: Date): boolean {
    const reservationTime = new Date(reservationDate).getTime();
    const currentTime = new Date().getTime();
    return currentTime > reservationTime + 30 * 60 * 1000;
  }

  oneHour(reservation: Reservation) {
    const reservationStartTime = new Date(reservation.date).getTime();
    const reservationEndTime = reservationStartTime + 3 * 60 * 60 * 1000;
    const extendedEndTime = reservationEndTime + 1 * 60 * 60 * 1000; 
  
    let canExtend = true;
  
    this.reservations.forEach(res => {
      if (res.table === reservation.table && res._id !== reservation._id && res.status === 'confirmed') {
        const resStartTime = new Date(res.date).getTime();
  
        if (resStartTime >= reservationEndTime && resStartTime < extendedEndTime) {
          canExtend = false;
        }
      }
    });
  
    if (canExtend) {
      reservation.extraHour = true;
      this.service.changeReservation(reservation).subscribe(data => {
        if (data) {
          let index = this.myConfirmedReservations.findIndex(res => res._id == reservation._id)
          this.myConfirmedReservations.splice(index, 1);
        }
      });
    } else {
      alert('Neuspešno, dolazi do preklapanja termina.');
    }
  }
  

    acceptReservation(){
      if (this.selectedTable == "") {
        this.acceptMessage = "Morate izabrati sto";
      } else {
        this.acceptMessage = "";
        this.currentReservation.status = "confirmed";
        this.currentReservation.table = this.selectedTable;
        this.currentReservation.waiter = this.user.username;
        
        this.service.changeReservation(this.currentReservation).subscribe(data => {
          if (data) {
            let index = this.allPendingReservations.findIndex(obj => obj._id == this.currentReservation._id);
            if (index !== -1) {
              if (!this.myConfirmedReservations.some(res => res._id === this.currentReservation._id)) {
                this.myConfirmedReservations.push(this.allPendingReservations[index]);
                this.myConfirmedReservations = this.myConfirmedReservations
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              }
              this.allPendingReservations.splice(index, 1);
              if (this.allPendingReservations.length > 0) {
                this.index--;
                this.nextReservation();
              } else {
                this.selectedTable = "";
                this.freeTables = [];
                this.drawLayout(this.layout);
              }
            }
          }
        });
      }
    }
    

  declineReservation(){
    if(this.rejectReason == ""){
      this.rejectMessage = "Morate uneti razlog odbijanja"
    }
    else{
      this.rejectMessage = "";
      this.currentReservation.status = "rejected"
      this.currentReservation.rejectReason = this.rejectReason;
      this.service.changeReservation(this.currentReservation).subscribe(data=>{
        if(data){
          let index = this.allPendingReservations.findIndex(obj => obj._id == this.currentReservation._id)
          this.allPendingReservations.splice(index, 1);
          if(this.allPendingReservations.length>0){
            this.index--;
            this.nextReservation();
          }else{
            this.selectedTable = "";
            this.freeTables = []
            this.drawLayout(this.layout)
          }
        }
      })
      
    }
  }

  previousReservation(){
    this.rejectMessage = "";
    this.acceptMessage = ""
    this.rejectReason = "";
    this.selectedTable = "";
    this.index--;
    if(this.index==-1) this.index = this.allPendingReservations.length-1
    this.currentReservation = this.allPendingReservations[this.index]
    this.setFreeTables();
  }

  nextReservation(){
    this.rejectMessage = "";
    this.acceptMessage = ""
    this.rejectReason = "";
    this.selectedTable = "";
    this.index++;
    if(this.index==this.allPendingReservations.length) this.index = 0
    this.currentReservation = this.allPendingReservations[this.index]
    this.setFreeTables();
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
        if(this.freeTables.length==0) ctx.strokeStyle = 'black'
        else{
          const isTableFree = this.freeTables.includes(table.tableName);
          ctx.strokeStyle = isTableFree ? 'black' : 'red';
          if(table.tableName==this.selectedTable) ctx.strokeStyle = 'red'
        }


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

  
  

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
