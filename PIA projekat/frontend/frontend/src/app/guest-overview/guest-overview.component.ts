import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-guest-overview',
  templateUrl: './guest-overview.component.html',
  styleUrls: ['./guest-overview.component.css']
})
export class GuestOverviewComponent implements OnInit{
  
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "admin"){
        this.router.navigate([this.user.type]);
      }
      else{
        this.service.getUsers("gost").subscribe(data => {
          if(data){
            this.users = data;
            this.usersToShow = this.users.filter(user => user.status == this.usertype);
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
  usersToShow: User[] = [];
  searchText: string = "";
  usertype: string = "active";

  setUserStatus(user: User, status: string){
    this.service.setUserStatus(user, status).subscribe(data => {
      if(data){
        this.service.getUsers("gost").subscribe(data => {
          if(data){
            this.users = data;
            this.usersToShow = this.users.filter(user => user.status == this.usertype);
          }
        })
      }
    })
  }

  search() {
    const searchTextLower = this.searchText.toLowerCase();
    this.usersToShow = this.users.filter(user => 
        user.status == this.usertype && 
        (user.username.toLowerCase().includes(searchTextLower) || 
         user.firstname.toLowerCase().includes(searchTextLower) || 
         user.lastname.toLowerCase().includes(searchTextLower))
    );
  }


  typeChange(){
    this.searchText = "";
    this.usersToShow = this.users.filter(user => user.status == this.usertype);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
