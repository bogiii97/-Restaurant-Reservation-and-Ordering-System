import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-main-page-gost',
  templateUrl: './main-page-gost.component.html',
  styleUrls: ['./main-page-gost.component.css']
})
export class MainPageGostComponent {
  constructor(private router: Router){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type != "gost"){
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
