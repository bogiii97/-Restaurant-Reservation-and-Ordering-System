import { Component } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-password-forget-admin',
  templateUrl: './login-password-forget-admin.component.html',
  styleUrls: ['./login-password-forget-admin.component.css']
})
export class LoginPasswordForgetAdminComponent {
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      this.router.navigate([this.user.type]);
    }
  }

  email: string = "";
  message: string = "";
  message1: string = "";
  message2: string = "";
  answer: string = "";
  password: string = "";
  password1: string = "";
  
  enterAnswer: boolean = false;
  enterPassword: boolean = false;
  flag: boolean = false;

  user: User = new User(); 

  getMail(){
    this.enterAnswer = false;
    this.enterPassword = false;
    this.answer = this.password = this.password1 = this.message1 = this.message2 = "";

    this.service.getAdminMail(this.email).subscribe(data =>{
      if(data != null){
        this.message = "";
        this.user = data;
        this.enterAnswer = true;
      }
      else{
        this.message = "Nevalidan imejl"
      }
    })
  }

  checkAnswer(){
    this.enterPassword = false;
    this.password = this.password1 = this.message2 = "" ;
    if(this.user.securityAnswer != this.answer){
      this.message1 = "Netačan odgovor";
    }
    else{
      this.message1 = "";
      this.enterPassword = true;
    }
  }
  
  passwordReset(){
    if(this.password != this.password1){
      this.message2 = "Lozinke se ne podudaraju";
    }
    else{
      const regex = /^(?=.*[A-Z])(?=(.*[a-z]){3})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z][A-Za-z\d!@#$%^&*]{5,9}$/;
      if(regex.test(this.password)){
        this.message2 = "";
        this.service.changePassword(this.user.email, this.password).subscribe(data=>{
          if(data != -1){
            this.flag = true;
          }
          else{
            this.message2 = "Desila se greška pri pokušaju izmene lozinke"
          }
        })
      }
      else{
        this.message2 = "Lozinka mora biti u sledećem formatu: Mora početi slovom, minimum 6 karaktera, maximum 10 karaktera, minimum jedan broj, jedan specijalan znak, tri mala slova, jedno veliko slovo"
      }
    }
  }

}
