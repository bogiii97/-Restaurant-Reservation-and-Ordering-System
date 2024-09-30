import { Component } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page-admin',
  templateUrl: './main-page-admin.component.html',
  styleUrls: ['./main-page-admin.component.css']
})
export class MainPageAdminComponent {
  constructor(private router: Router){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "admin"){
        this.router.navigate([this.user.type]);
      }
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User(); 

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
