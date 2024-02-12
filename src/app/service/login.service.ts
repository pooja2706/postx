import { Injectable } from '@angular/core';
import e from 'express';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  auth
  state:boolean=false
  constructor() {
    this.auth=getAuth();
    onAuthStateChanged(this.auth, (user)=>{
      if(user){
        this.state=true;
        console.log(this.state);

      }
      else{
        this.state=false
      }
    })
  }

  checkSignIn(): boolean{
    console.log(this.state);

    return this.state
  }
}
