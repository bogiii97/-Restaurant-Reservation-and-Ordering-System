import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {

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
      this.service.loginAdmin(this.username, this.password).subscribe(
        data => {
          if(data != null){
            this.message = "";
            sessionStorage.setItem("logged", JSON.stringify(data));
            console.log("ok")
            this.router.navigate(['admin']);
          }
          else{
            this.message = "Neispravna korisničko ime ili lozinka, pokušajte ponovo!"
          }
        }
      )
    }
  }
}
