import { CommonModule } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { Router } from 'express';
import { Auth, getAuth, User } from 'firebase/auth';
import { logopath } from '../../../constants/imagepath';
import { FirebasesdataService } from '../../service/firebasesdata.service';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeedComponent,
    UsersComponent,
    ProfileComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  auth: Auth
  user: User|null=null
  name: string=''
  feedstate: boolean=false;
  profilestate: boolean=false;
  userstate: boolean=false
  logopath=logopath
  constructor(router: Router, firebaseservice: FirebasesdataService){
    this.auth=getAuth()
    this.auth.onAuthStateChanged(async (user)=>{
      if(user){
        this.user=user
        this.name=await firebaseservice.getfieldData('users/'+user.uid, 'name')||''
        this.feedstate=true

      }
      else{
        router.navigateByUrl('login')
        // router.navigateByUrl('signup')
      }
    })
  }

  feed(): void{
    this.feedstate=true
    this.userstate=false;
    this.profilestate=false
  }
  users(): void{
    this.userstate=true;
    this.feedstate=false;
    this.profilestate=false
  }
  profile(): void{
    this.profilestate=true;
    this.feedstate=false;
    this.userstate=false
  }
}
