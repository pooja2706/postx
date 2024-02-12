import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class LogState{
  state: boolean=false;
  uid: string='';
  setState(state: boolean){
    this.state=state;
  }
  setUid(uid: string){
    this.uid=uid
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyC0v9q7cOwd-U9tkMxYLwHbz2yUaNyqVf4",
  authDomain: "tweetx-e27f4.firebaseapp.com",
  projectId: "tweetx-e27f4",
  storageBucket: "tweetx-e27f4.appspot.com",
  messagingSenderId: "428288643633",
  appId: "1:428288643633:web:71e6d27fc347a84b693b10"
};
export const app = initializeApp(firebaseConfig);
