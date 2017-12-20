import {Component } from '@angular/core';
import {NavController, ActionSheetController, AlertController, ToastController, Events} from 'ionic-angular';
import {GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, GoogleMapsAnimation } from '@ionic-native/google-maps';
import {Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';
@Component({
  selector: 'page-insert',
  templateUrl: 'insert.html',
  providers: [GoogleMaps, Geolocation, Device]
})
export class Insert{
    M:GoogleMap;
    C:any={
		apiKey:'AIzaSyB0qXmYRiWngb2XhGMGhtWlz27KwQgLNOE',
		authDomain:' api-project-727912293125.firebaseapp.com',
		databaseURL:'https://api-project-727912293125.firebaseio.com/',
		storageBucket:'gs://api-project-727912293125.appspot.com'
    }
    constructor(private G: GoogleMaps, private Geo: Geolocation, public A: ActionSheetController, public AC: AlertController, private T: ToastController, public E: Events, private D:Device) {
    }
    ngAfterViewInit() {
        this.Geo.getCurrentPosition().then((L)=>{
            this.Mapper(L.coords.latitude, L.coords.longitude);
        }).catch(()=>{
            this.Mapper(20.641226, -105.232928);
        });
    }
    Mapper(La,Lo){
        try{
            this.M=this.G.create('GMap',{
            controls:{
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            }, gestures: {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            }, camera:{
                'latLng': new LatLng(La,Lo),
                'tilt': 30,
                'zoom': 15,
                'bearing': 50
            }
        });
        }catch(e){
            this.T.create({
                message:e,
                position: 'top'
            }).present();
        }
        this.M.one(GoogleMapsEvent.MAP_READY).then(()=>{
            firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid).once('value').then((Z)=>{
                console.log(Z.val().Plomeria)
                if(Z.val().Carpinteria){
                    this.Markup(new LatLng(Z.val().Carpinteria.Pos.slice(0,Z.val().Carpinteria.Pos.indexOf(',')-1),Z.val().Carpinteria.Pos.slice(Z.val().Carpinteria.Pos.indexOf(',')+1,Z.val().Carpinteria.Pos.length)));
                    if(Z.val().Carpinteria.Stat==1){
                        this.M.setClickable(false);
                        firebase.database().ref('chambitasdotcom/cli/'+Z.val().Carpinteria.Tech).once('value',Z=>{
                          this.A.create({
                              title:'Servicio aceptado',
                              subTitle:'Su servicio ha sido aceptado, el tecnico es '+ Z.val().N,
                              buttons:[{
                                      text:'Ok',
                                      handler:()=>{
                                          this.M.setClickable(true)
                                      }
                                  }
                              ], enableBackdropDismiss: false
                          }).present();
                        });
                    }
                }
                if(Z.val().Plomeria){
                  this.Markup(new LatLng(Z.val().Plomeria.Pos.slice(0,Z.val().Plomeria.Pos.indexOf(',')-1),Z.val().Plomeria.Pos.slice(Z.val().Plomeria.Pos.indexOf(',')+1,Z.val().Plomeria.Pos.length)));
                  if(Z.val().Plomeria.Stat==1){
                    this.M.setClickable(false)
                    firebase.database().ref('chambitasdotcom/cli/'+Z.val().Plomeria.Tech).once('value',Z=>{
                      this.A.create({
                        title:'Servicio aceptado',
                        subTitle:'Su servicio ha sido aceptado, el tecnico es '+ Z.val().N,
                        buttons:[{
                          text:'Ok',
                          handler:()=>{
                            this.M.setClickable(true)
                          }
                        }], enableBackdropDismiss: false
                      }).present();
                    });
                  }
                }
            });
            firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid).on('child_changed', Z=>{
                console.log(JSON.stringify(Z))
                if(Z.val().Stat==1&&Z.val().Tech!=''){
                  firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid).off()
                  this.M.setClickable(false)
                  firebase.database().ref('chambitasdotcom/cli/'+Z.val().Tech).once('value',Z=>{
                    this.A.create({
                      title:'Servicio aceptado',
                      subTitle:'Su servicio ha sido aceptado, el tecnico es '+ Z.val().N,
                      buttons:[{
                        text:'Ok',
                        handler:()=>{
                          this.M.setClickable(true)
                        }
                      }], enableBackdropDismiss: false
                    }).present();
                  });
              }
            })
        });
    }
    Serv(){
        this.M.setClickable(false);
        this.A.create({
            title:'Que servicio desea',
            buttons:[
                {
                    text:'Plomeria',
                    handler:()=>{
                      firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/Plomeria').once('value',Z=>{
                        if(Z.val()){
                          this.M.setClickable(false);
                          this.AC.create({
                            title:'Servicio negado',
                            message:'Ud. ya tiene un servicio solicitado, lo estamos atendiendo!',
                            buttons:[{
                              text:'Ok',
                              handler:()=>{
                                this.M.setClickable(true);
                              }
                            }]
                          }).present();
                        } else {
                          this.Diologue('Plomeria','400');
                        }
                      });
                    }
                },{
                    text:'Carpinteria',
                    handler:()=>{
                      firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/Carpinteria').once('value',Z=>{
                        if(Z.val()){
                          this.M.setClickable(false);
                          this.AC.create({
                            title:'Servicio negado',
                            message:'Ud. ya tiene un servicio solicitado, lo estamos atendiendo!',
                            buttons:[{
                              text:'Ok',
                              handler:()=>{
                                this.M.setClickable(true);
                              }
                            }]
                          }).present();
                        } else {
                          this.Diologue('Carpinteria', '700');
                        }
                      })
                    }
                }
            ], enableBackdropDismiss: false
        }).present();
    }
    Markup(L:LatLng){
        console.log(JSON.stringify(L))
        this.M.addMarker(new Marker({
            })
        ).then((M:Marker)=>{
            M.setPosition(L);
            M.setIcon({
                url:'./assets/Img/GPS.png',
                size:({width: 17, height:51})
            });
        });
    }
    Diologue(S:string,C:string){
        this.A.create({
            title:'Que servicio desea',
            buttons:[
                {
                    text:'En mi ubicacion',
                    handler:()=>{
                      this.M.setClickable(false);
                        this.Geo.getCurrentPosition().then((L)=>{
                            this.AC.create({
                                title: 'Confirme orden',
                                message: 'El costo aproximado por el servicio de '+S+' es de '+C+' pesos. \n Acepta los terminos de servicio y costo?',
                                buttons:[
                                    {
                                        text:'Si',
                                        handler:()=>{
                                          this.M.setClickable(false);
                                          this.Markup(new LatLng(L.coords.latitude,L.coords.longitude));
                                          firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Pos').set(L.coords.latitude+','+L.coords.longitude);
                                          firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Stat').set(0);
                                          firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Pay').set(C);
                                          firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Tech').set('').then(()=>{
                                            this.AC.create({
                                              title:'Servicio registrado',
                                              message:'Su servicio fue registrado con exito, se le avisara cuando un tecnico vaya en camino',
                                              buttons:[{
                                                text:'Ok',
                                                handler:()=>{
                                                  this.M.setClickable(true);
                                                }
                                              }]
                                            }).present();
                                          });
                                        }
                                    },{
                                        text:'No',
                                        role:'cancel',
                                        handler:()=>{
                                            this.M.setClickable(true);
                                        }
                                    }
                                ]
                            }).present();
                        }).catch(()=>{
                            this.AC.create({
                                title:'Error de localizacion',
                                message:'Ocurrio un error obteniendo su ubicacion Servicio no solicitado!',
                                buttons: [{
                                    text:'OK',
                                    handler:()=>{this.M.setClickable(true)}
                                }]
                            }).present();
                        });
                    }
                },{
                    text:'En otra ubicacion',
                    handler:()=>{
                      this.M.setClickable(true);
                        let T = this.T.create({
                            message:'Deje presionado en el mapa donde le gustaria que fuera el servicio',
                            position:'top'
                        });
                        T.present().then(()=>{
                            this.M.one(GoogleMapsEvent.MAP_LONG_CLICK).then((L:LatLng)=>{
                                this.M.setClickable(false);
                                this.AC.create({
                                    title: 'Confirme orden',
                                    message: 'El costo aproximado por el servicio de '+S+' es de '+C+' pesos. \n Acepta los terminos de servicio y costo?',
                                    buttons:[
                                        {
                                            text:'Si',
                                            handler:()=>{
                                              this.M.setClickable(false);
                                                console.log(JSON.stringify(L))
                                                this.Markup(L);
                                                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Pos').set(L.lat+','+L.lng);
                                                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Pay').set(C);
                                                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Stat').set(0);
                                                firebase.database().ref('chambitasdotcom/cli/'+this.D.uuid+'/'+S+'/Tech').set('').then(()=>{
                                                  this.AC.create({
                                                    title:'Servicio registrado',
                                                    message:'Su servicio fue registrado con exito, se le avisara cuando un tecnico vaya en camino',
                                                    buttons:[{
                                                      text:'Ok',
                                                      handler:()=>{
                                                        this.M.setClickable(true);
                                                      }
                                                    }]
                                                  }).present();
                                                })
                                                T.dismiss();
                                            }
                                        },{
                                            text:'No',
                                            role:'cancel',
                                            handler:()=>{
                                                T.dismiss();
                                                this.M.setClickable(true);
                                            }
                                        }
                                    ]
                                }).present();
                            });
                        });
                    }
                }
            ],enableBackdropDismiss:false
        }).present();
    }
}
