import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      if(this.user.type == "admin"){
        this.router.navigate([this.user.type]);
      }
      const parts = this.user.creditCardNumber.split('-');
      if(parts.length === 4) {
        this.creditCardHidden = `${parts[0].substring(0, 4)}-****-****-${parts[3].substring(0,4)}`;
      }
    }
    else{
      this.router.navigate(['']);
    }
  }

  user: User = new User(); 
  creditCardHidden: string = "";
  profilePictureError: string = "";
  flag: boolean = false;

  choice: string = "password";
  password: string = "";
  passwordAgain: string = "";
  securityQuestion: string = "";
  securityAnswer: string = "";
  address: string = "";
  phone: string = "";
  creditCardNumber: string = "";

  passwordError: string = "";
  phoneNumberError: string = "";
  creditCardError: string = "";
  questionError: string = "";
  addressError: string = "";
  message: string = "";


  changeFlag(){
    this.flag = !this.flag;
    this.resetFields();
  }

  resetFields(): void {
    this.password = "";
    this.passwordAgain = "";
    this.securityQuestion = "";
    this.securityAnswer = "";
    this.address = "";
    this.phone = "";
    this.creditCardNumber = "";

    this.passwordError = "";
    this.phoneNumberError = "";
    this.creditCardError = "";
    this.questionError = "";
    this.addressError = "";
    this.message = "";
    this.choice = "password";
  }

  change(){
    const phoneRegex = /^(\+3816\d{7,8}|06\d{7,8})$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
    const creditCardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    let ok = false;
    
    if(this.choice == "password"){
      if(this.password == "" || this.passwordAgain == ""){
        this.passwordError = "Morate popuniti oba polja"
      } else if(!passwordRegex.test(this.password)){
        this.passwordError = "Šifra mora imati od 6 do 10 slova, mora početi slovom i imati minimum 1 veliko i 3 mala slova, 1 broj, 1 specijalan znak"
      }
      else if(this.password != this.passwordAgain){
        this.passwordError = "Šifre moraju da se poklapaju"
      }
      else{
        this.user.password = this.password;
        ok = true;
        this.password = this.passwordAgain = this.passwordError = "";
      }
    }
    else if(this.choice == "securityQuestion"){
      if(this.securityQuestion == "" || this.securityAnswer == ""){
        this.questionError = "Morate popuniti oba polja";
      }else{
        ok = true;
        this.user.securityQuestion = this.securityQuestion;
        this.user.securityAnswer = this.securityAnswer;
        this.securityAnswer = this.securityQuestion = this.questionError = "";
      }
    }
    else if(this.choice == "address"){
      if(this.address == ""){
        this.addressError = "Morate popuniti polje prvo";
      }
      else{
        ok = true;
        this.user.address = this.address;
        this.address = this.addressError = "";
      }
    }
    else if(this.choice == "phone"){
      if(this.phone == ""){
        this.phoneNumberError = "Morate popuniti polje prvo"
      }
      else if(!phoneRegex.test(this.phone)){
        this.phoneNumberError = "Telefon nije u odgovarajućem formatu"
      }
      else{
        ok = true;
        this.user.phone = this.phone;
        this.phone = this.phoneNumberError = "";
      }
    }
    else if(this.choice == "creditCardNumber"){
      if(this.creditCardNumber == ""){
        this.creditCardError = "Morate popuniti polje prvo";
      }
      else if(!creditCardRegex.test(this.creditCardNumber)){
        this.creditCardError = "Kreditna kartica nije u formatu XXXX-XXXX-XXXX-XXXX"
      }
      else{
        ok = true;
        this.user.creditCardNumber = this.creditCardNumber;
        this.creditCardNumber = this.creditCardError = "";
      }
    }
    if(!ok) return;

    this.message = "Uspešno izvršeno"
    setTimeout(() => {
      this.message = "";
    }, 3000);
    this.service.changeProfile(this.user).subscribe(data =>{
      if(data){
        sessionStorage.setItem("logged", JSON.stringify(this.user));
      }
    })
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  
  validateProfilePicture(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    const allowed_file_types = ['image/png', 'image/jpg', 'image/jpeg'];
    const max_size = 3 * 1024 * 1024; // 3MB

    if (file && allowed_file_types.includes(file[0].type) && file[0].size <= max_size) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const image = new Image();
            image.onload = () => {
                if (image.width >= 100 && image.width <= 300 && image.height >= 100 && image.height <= 300) {
                    this.user.profilePicture = base64; // Postavite Base64 string u model korisnika
                    this.profilePictureError = "";
                    this.service.changeProfile(this.user).subscribe(data =>{
                      if(data){
                        sessionStorage.setItem("logged", JSON.stringify(this.user));
                      }
                    })
                } else {
                    this.profilePictureError = "Dimenzija slike mora biti između 100x100px i 300x300px";
                }
            };
            image.onerror = () => {
                this.profilePictureError = "Greška pri učitavanju slike";
            };
            image.src = base64;
        };
        reader.readAsDataURL(file[0]);
    } else if (file && !allowed_file_types.includes(file[0].type)) {
        console.log(file[0].type)
        this.profilePictureError = "Podržavamo samo jpg i png ekstenzije";
    } else if (file && file[0].size > max_size) {
        this.profilePictureError = "Fajl mora biti manji od 3MB";
    } else {
        this.profilePictureError = "Greška pri učitavanju slike";
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
