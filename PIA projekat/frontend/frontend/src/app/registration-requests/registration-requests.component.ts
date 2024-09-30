import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.css']
})
export class RegistrationRequestsComponent implements OnInit{

  constructor(private router: Router, private service: UserService){}


  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "admin"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getRegistrationRequests().subscribe(data => {
          if(data){
            this.users = data;
          }
        })
      }
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User(); 
  users: User[] = [];

  setUserStatus(user: User, status: string){
    this.service.setUserStatus(user, status).subscribe(data => {
      if(data){
        this.ngOnInit();
      }
    })
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
