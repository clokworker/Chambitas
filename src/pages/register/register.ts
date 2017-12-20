import {Component } from '@angular/core';
import { NavController, AlertController, ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[Device]
})
export class Register {
    F:FormGroup;P:string;
    C:any={
		apiKey:'AIzaSyB0qXmYRiWngb2XhGMGhtWlz27KwQgLNOE',
		authDomain:' api-project-727912293125.firebaseapp.com',
		databaseURL:'https://api-project-727912293125.firebaseio.com/',
		storageBucket:'gs://api-project-727912293125.appspot.com'
    }
    constructor(public N: NavController, public Fb:FormBuilder, private D:Device, private Ac:AlertController, private T: ToastController){
        this.F= Fb.group({
            name:['',Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.email, Validators.required])],
            dateBirth: ['', Validators.required],
            passwordRetry: this.Fb.group({
                password: ['', Validators.required],
                passwordConfirmation: ['', Validators.required]
            },{
                validator:this.Eq
            }),
            gender: ['', Validators.required],
        });
    }
    Eq(group:FormGroup){
        if(group.controls['password'].value!=group.controls['passwordConfirmation'].value){
            return{
                Eq:false
            }
        } else {
            return null;
        }
    }
    DBer(){
        firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid).once('value').then((Z)=>{
            console.log(Z.val())
            if(Z.val()!=null){
                this.Ac.create({
                    title:'Error al registrar!',
                    message:'Ya esta registrado olvido su contraseña?',
                    buttons: ['OK']
                }).present();
            } else {
                console.log(this.P)
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/N').set(this.F.value.name);
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/L').set(this.F.value.lastName);
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/e').set(this.F.value.email);
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/C').set(this.F.value.dateBirth);
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/P').set(this.P);
                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/G').set(this.F.value.gender);
                this.N.pop().then(()=>{
                    this.T.create({
                        message:'Usuario registrado exitosamente!',
                        position:'bottom'
                    })
                })
            }
        });
    }
}