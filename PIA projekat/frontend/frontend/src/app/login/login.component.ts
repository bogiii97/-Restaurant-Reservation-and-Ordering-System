import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      this.router.navigate([this.user.type]);
    }
  }

  username: string = "";
  password: string = "";
  message: string = "";

  user: User = new User(); 

  login(){
    if(this.username == "" || this.password == ""){
      this.message = "Morate prvo uneti sva polja";
    }
    else{
      this.message = "";
      this.service.login(this.username, this.password).subscribe(
        data => {
          if(data != null){
            this.message = "";
            sessionStorage.setItem("logged", JSON.stringify(data));
            if(data.type == "konobar"){
              this.router.navigate(["/konobar/reservations"]);
            }
            else if(data.type == "gost"){
              this.router.navigate(["/gost/restaurants"]);
            }
            
          }
          else{
            this.message = "Neispravna korisničko ime ili lozinka, pokušajte ponovo!"
          }
        }
      )
    }
  }
}
