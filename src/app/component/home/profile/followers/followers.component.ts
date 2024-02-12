import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getAuth, User } from 'firebase/auth';
import { UserData } from '../../../../model/usersdata';
import { FirebasesdataService } from '../../../../service/firebasesdata.service';

interface CardDetails{
  userdata: UserData,
  following: boolean
  followerslist: number,
  loading: boolean
}
@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.css'
})
export class FollowersComponent {
  auth;
  user: User|null=null
  followersid: string[]=[]
  pageloading: boolean=true
  constructor(private firebaseservice: FirebasesdataService){
    this.auth=getAuth()
    this.auth.onAuthStateChanged((user)=>{
      this.user=user
    })

    this.getFollowersList().then(()=>{
      // console.log('list done');

      this.getFollowersDetail()
    })
  }

  async getFollowersList(){
    // console.log(this.user?.uid);

    await this.firebaseservice.getfieldData('users/'+this.auth.currentUser?.uid, 'followers').then((val)=>{
      // console.log(val);

      this.followersid=val
    })
  }

  followers: CardDetails[]=[]

  async setCardDetails(id: string){
    const userdata=await this.firebaseservice.getUserDetails(id)
    const following=await this.firebaseservice.checkfollowing(this.auth.currentUser?.uid||'', id)
    let followerslist: number= await this.firebaseservice.countArrayFieldElements('users/'+id, 'followers')
    this.followers.push({userdata: userdata, following: following, followerslist: followerslist, loading:false})
    this.pageloading=false
  }

  getFollowersDetail(){
    this.followersid.forEach(async (id)=>{
      await this.setCardDetails(id)
    })
    // console.log(this.followersid);

    // console.log(this.followers);

  }

  async follow(card: CardDetails){
    card.loading=true
    await this.firebaseservice.follow(this.auth.currentUser?.uid||'', card.userdata.userid).then((val)=>{
      if(val){
        card.following=true
      }
    })
    card.loading=false
  }

  async unfollow(card: CardDetails){
    card.loading=true
    await this.firebaseservice.unfollow(this.auth.currentUser?.uid||'', card.userdata.userid).then((val)=>{
      if(val){
        card.following=false
      }
    })
    card.loading=false
  }
  // checkFollowers()
}
