import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Reservation } from '../models/reservations';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-statistics-konobar',
  templateUrl: './statistics-konobar.component.html',
  styleUrls: ['./statistics-konobar.component.css']
})
export class StatisticsKonobarComponent implements OnInit {

  constructor(private router: Router, private service: UserService) {}

  user: User = new User();
  restaurantReservations: Reservation[] = [];
  myReservations: Reservation[] = [];
  waiterGuestsCount: { [key: string]: number } = {};
  daysOfWeek: { [key: string]: { count: number, count1: number, reservations: number, percentage: number } } = {
    'Mon': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Tue': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Wed': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Thu': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Fri': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Sat': { count: 0, count1:0, reservations: 0, percentage: 0 },
    'Sun': { count: 0, count1:0, reservations: 0, percentage: 0 }
  };

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if (u != null) {
      this.user = JSON.parse(u);
      if (this.user.type != "konobar") {
        this.router.navigate([this.user.type]);
      } else {
        this.service.getRestaurantReservations(this.user.restaurant).subscribe(data => {
          if (data) {
            this.restaurantReservations = data.filter(obj => obj.status == "confirmed" && obj.arrived == "Da");
            this.calculateWaiterDistribution();
            this.createWaiterDistributionChart();
          }
        });

        this.service.getWaiterReservations(this.user.username).subscribe(data => {
          if (data) {
            console.log(data);
            this.myReservations = data.filter(obj => obj.status == "confirmed" && obj.arrived == "Da");
            this.calculateGuestsPerDay();
            this.createGuestsPerDayChart();
            this.calculateAverageReservations();
            this.createAverageReservationsChart();
          }
        });
      }
    } else {
      this.router.navigate(['']);
    }
  }

  calculateGuestsPerDay() {
    this.myReservations.forEach(reservation => {
      const day = new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'short' });
      this.daysOfWeek[day].count += reservation.numberOfPeople;
    });
  }

  createGuestsPerDayChart() {
    const ctx = document.getElementById('guestsPerDayChart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.daysOfWeek),
        datasets: [{
          label: 'Broj gostiju',
          data: Object.values(this.daysOfWeek).map(day => day.count),
          backgroundColor: '#2d308c',  
          borderColor: '#2d308c',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1 
            }
          }
        }
      }
    });
  }

  calculateWaiterDistribution() {
    this.restaurantReservations.forEach(reservation => {
      const waiter = reservation.waiter;
      if (!this.waiterGuestsCount[waiter]) {
        this.waiterGuestsCount[waiter] = 0;
      }
      this.waiterGuestsCount[waiter] += reservation.numberOfPeople;
    });
  }

  createWaiterDistributionChart() {
    const ctx = document.getElementById('waiterDistributionChart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.waiterGuestsCount),
        datasets: [{
          data: Object.values(this.waiterGuestsCount),
          backgroundColor: Object.keys(this.waiterGuestsCount).map(() => this.getRandomColor()),
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1
        }]
      }
    });
  }
  /*
  calculateAverageReservations() {
    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    this.restaurantReservations.forEach(reservation => {
      const reservationDate = new Date(reservation.date);
      if (reservationDate >= twoYearsAgo && reservationDate <= now) {
        const day = reservationDate.toLocaleDateString('en-US', { weekday: 'short' });
        this.daysOfWeek[day].count1++;
        this.daysOfWeek[day].reservations++;
      }
    });
  }

  createAverageReservationsChart() {
    const ctx = document.getElementById('averageReservationsChart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.daysOfWeek),
        datasets: [{
          label: 'Prosječan broj rezervacija',
          data: Object.values(this.daysOfWeek).map(day => day.count1 / 104),
          backgroundColor: '#2d308c', 
          borderColor: '#2d308c',
          borderWidth: 1,
          barPercentage: 1.0,
          categoryPercentage: 1.0
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false 
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false
            }
          }
        }
      }
    });
  }*/

    calculateAverageReservations() {
      const now = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
      let totalReservations = 0;
    
      this.restaurantReservations.forEach(reservation => {
        const reservationDate = new Date(reservation.date);
        if (reservationDate >= twoYearsAgo && reservationDate <= now) {
          const day = reservationDate.toLocaleDateString('en-US', { weekday: 'short' });
          console.log(day);
          this.daysOfWeek[day].count1++;
          totalReservations++;
        }
      });
    
      for (const day in this.daysOfWeek) {
        if (this.daysOfWeek[day].count1 > 0) {
          console.log(this.daysOfWeek[day]);
          this.daysOfWeek[day].percentage = (this.daysOfWeek[day].count1 / totalReservations) * 100;
        } else {
          this.daysOfWeek[day].percentage = 0;
        }
      }
    }
    
    
    createAverageReservationsChart() {
      const ctx = document.getElementById('averageReservationsChart') as HTMLCanvasElement;
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.daysOfWeek),
          datasets: [{
            label: 'Procenat rezervacija',
            data: Object.values(this.daysOfWeek).map(day => day.percentage),
            backgroundColor: '#2d308c', 
            borderColor: '#2d308c',
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 1.0
          }]
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false 
              }
            },
            y: {
              beginAtZero: true,
              max: 100, // Postavlja maksimalnu vrednost na 100%
              grid: {
                display: false
              },
              ticks: {
                callback: function(value) {
                  return value + '%'; // Dodaje znak % na vrednosti y-osi
                }
              }
            }
          }
        }
      });
    }
  
    
  

  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  
  logout() {
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
