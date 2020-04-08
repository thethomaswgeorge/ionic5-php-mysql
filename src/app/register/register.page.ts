import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController} from '@ionic/angular';
import { AccessProviders } from './../providers/access-providers';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  [x: string]: any;

  your_name: string = "";
  gender: string ="";
  email_address: string = "";
  password: string = "";
  confirm_password: string = "";

  disabledButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }

  async tryRegister() {
    if(this.your_name == ""){
      this.presentToast("Your name is required");
    }else if(this.gender =="") {
      this.presentToast("Your gender is required");
    }else if(this.email_address == ""){
      this.presentToast("Your e-mail address is required");
    }else if(this.password =="") {
      this.presentToast("Your password is required");
    }else if(this.confirm_password == "") {
      this.presentToast("Please confirm your password")
    }else if(this.confirm_password != this.password){
      this.presentToast("Passwords are not the same");
    }else {
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Please Wait',
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: 'process_register',
          your_name: this.your_name,
          gender: this.gender,
          email_address: this.email_address,
          password: this.password
        }

        this.accsPrvds.postData(body, 'process_api.php').subscribe((res:any)=> {
          console.log(res);
          if(res != null) {
            if(res.success == true) {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.msg);
              this.router.navigate(['/login']);
  
            }else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast(res.msg);   
            }
          }
        }, (err)=> {
          loader.dismiss();
          this.disabledButton = false;
          this.presentToast(err);
          console.log(err);

        });
      })
    }
  }

  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }

 

}
