import { Component } from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import {Insert} from '../insert/insert';
import {Register} from '../register/register';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Device]
})
export class HomePage {
  U:string;P:string;
  C:any={
		apiKey:'AIzaSyB0qXmYRiWngb2XhGMGhtWlz27KwQgLNOE',
		authDomain:' api-project-727912293125.firebaseapp.com',
		databaseURL:'https://api-project-727912293125.firebaseio.com/',
		storageBucket:'gs://api-project-727912293125.appspot.com'
  }
  constructor(public N: NavController, private D:Device, private Ac:AlertController) {
    firebase.initializeApp(this.C)
  }
  Reg(){
    let go= Register;
    this.N.push(go);
  }
  Log(){
    firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid).once('value').then((Z)=>{
      if(Z.val()!=null){
        if(Z.val().e==this.U&&Z.val().P==this.P){
          let go = Insert;
          this.N.setRoot(go);
        } else {
          this.Ac.create({
            title:'Error de autentificacion',
            message:'Contraseña y/o usuarios incorrecto',
            buttons: ['OK']
          }).present();
        }
      } else {
        this.Ac.create({
          title:'Error de autentificacion',
          message:'No esta registrado, para usar la plataforma tiene que registrarse!',
          buttons: ['OK']
        }).present();
      }
    })
  }
}
