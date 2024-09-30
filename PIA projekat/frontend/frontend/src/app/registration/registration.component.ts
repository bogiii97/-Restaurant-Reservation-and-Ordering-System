import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  constructor(private router: Router, private service: UserService){}

  ngOnInit(): void {
    let u = sessionStorage.getItem("logged");
    if(u != null){
      this.user = JSON.parse(u);
      this.router.navigate([this.user.type]);
    }
    this.user.gender = "muški"
  }

  profilePictureError: string = "";
  usernameError: string = "";
  phoneNumberError: string = "";
  emailError: string = "";
  passwordError: string = "";
  creditCardError: string = "";
  fieldError: string = "";
  flag: boolean = false;

  user: User = new User(); 

  validateProfilePicture(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    const allowed_file_types = ['image/png', 'image/jpg', 'image/jpeg'];
    const max_size = 3 * 1024 * 1024; // 3MB
    this.user.profilePicture = "";

    if (file && allowed_file_types.includes(file[0].type) && file[0].size <= max_size) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            const image = new Image();
            image.onload = () => {
                if (image.width >= 100 && image.width <= 300 && image.height >= 100 && image.height <= 300) {
                    this.user.profilePicture = base64; 
                    this.profilePictureError = "";
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

  setDefaultProfilePicture(): Promise<string> {
    return new Promise((resolve, reject) => {
        const imgPath = '../../assets/profilePicture1.png';
        const img = new Image();
        
        img.src = imgPath;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/png');
                resolve(base64);
            } else {
                reject('Kontekst kanvasa nije dostupan.');
            }
        };
        img.onerror = () => {
            reject('Greška pri učitavanju podrazumevane slike.');
        };
    });
  }


  async registration(){
    let ok = true;
    this.phoneNumberError = this.emailError = this.passwordError = this.creditCardError = this.usernameError = this.profilePictureError = "" ;
    if (
      this.user.username === "" ||
      this.user.password === "" ||
      this.user.securityQuestion === "" ||
      this.user.securityAnswer === "" ||
      this.user.firstname === "" ||
      this.user.lastname === "" ||
      this.user.gender === "" ||
      this.user.address === "" ||
      this.user.phone === "" ||
      this.user.email === "" ||
      this.user.creditCardNumber === "") {
      this.fieldError = "Morate popuniti sva polja označena sa *"
    } else{
      this.fieldError = "";
      const phoneRegex = /^(\+3816\d{7,8}|06\d{7,8})$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
      const creditCardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      
      if(this.user.profilePicture === ""){
        try {
            this.user.profilePicture = await this.setDefaultProfilePicture();
        } catch (error) {
            console.error(error);
            this.profilePictureError = "Greška pri učitavanju podrazumevane slike.";
            return;
        }
      }

      if(!phoneRegex.test(this.user.phone)){
        ok = false;
        this.phoneNumberError = "Broj nije u odgovarajućem formatu"
      }

      if(!passwordRegex.test(this.user.password)){
        ok = false;
        this.passwordError = "Šifra mora imati od 6 do 10 slova, mora početi slovom i imati minimum 1 veliko i 3 mala slova, 1 broj, 1 specijalan znak"
      }

      if(!emailRegex.test(this.user.email)){
        ok = false;
        this.emailError = "Mejl nije u odgovarajućem formatu"
      }

      if(!creditCardRegex.test(this.user.creditCardNumber)){
        ok = false;
        this.creditCardError = "Kreditna kartica nije u formatu XXXX-XXXX-XXXX-XXXX"
      }

      if(!ok) return;

      this.user.type = "gost";
      this.user.status = "pending";
      this.user.restaurant = "";
      this.user.numberOfNotComing = 0;
      
      console.log(this.user.profilePicture);

      this.service.register(this.user).subscribe(data => {
        if (data) {
          if(data.message == "Registration successful"){
            this.flag = true;
          }
          else if(data.message == "Email already in use"){
            this.emailError = "Ovaj mejl je već u upotrebi";
          }
          else if(data.message == "Username already in use"){
            this.usernameError = "Ovo korisničko ime je već u upotrebi"
          }
          
        } else {
          alert("Nema vraćenih podataka!");
        }
      })

    }
    
  }
}
