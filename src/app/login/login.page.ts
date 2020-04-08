import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController} from '@ionic/angular';
import { AccessProviders } from './../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email_address: string = "";
  password: string = "";
  disabledButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accsPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.disabledButton = false;
  }

  async tryLogin() {
     if(this.email_address == ""){
      this.presentToast("Your e-mail address is required");
    }else if(this.password =="") {
      this.presentToast("Your password is required");
    }else {
      this.disabledButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Please Wait',
      });
      loader.present();

      return new Promise(resolve => {
        let body = {
          aksi: 'process_login',
          email_address: this.email_address,
          password: this.password
        }

        this.accsPrvds.postData(body, 'process_api.php').subscribe((res:any)=> {
          console.log(res);
          if(res != null) {
            console.log("tacos");
            console.log(res);
            if(res.success == true) {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast('Login Successful!');
              this.storage.set('storage_xxx', res.result); //Create storage session
              this.navCtrl.navigateRoot(['/home']);
  
            }else {
              loader.dismiss();
              this.disabledButton = false;
              this.presentToast('Sorry, that is incorrect');
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
  openRegister() {
    this.router.navigate(['/register']);
  }
}
