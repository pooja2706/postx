import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getAuth } from 'firebase/auth';
import { UserData } from '../../../../model/usersdata';
import { FirebasesdataService } from '../../../../service/firebasesdata.service';
interface CardDetails{
  user: UserData,
  following: boolean,
  followers: number,
  loading: boolean
}
@Component({
  selector: 'app-following',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinner
  ],
  templateUrl: './following.component.html',
  styleUrl: './following.component.css'
})
export class FollowingComponent {
  auth
  pageloading: boolean=true
  constructor(private firebaseService: FirebasesdataService){
    this.auth=getAuth();
    // this.auth.onAuthStateChanged((user)=>{
    //   if(user){

    //   }
    //   else{

    //   }
    // })
    this.getFollowingList();
  }
  carddetails: CardDetails[]=[]
  async getFollowingList(){
    const followingid: string[]=await this.firebaseService.getfieldData('users/'+this.auth.currentUser?.uid, 'following')
    followingid.forEach(async (id)=>{
      await this.setCardDetails(id)
    })
  }
  async setCardDetails(id: string){
    const user=await this.firebaseService.getUserDetails(id);
    const followers=await this.firebaseService.countArrayFieldElements('users/'+id, 'followers')
    const following=await this.firebaseService.checkfollowing(this.auth.currentUser?.uid||'', id)
    this.carddetails.push({user: user, following: following, followers: followers, loading: false})
    this.pageloading=false
  }

  async follow(card: CardDetails){
    card.loading=true
    await this.firebaseService.follow(this.auth.currentUser?.uid||'', card.user.userid).then((val)=>{
      if(val){
        card.following=true
      }
    })
    card.loading=false
  }

  async unfollow(card: CardDetails){
    card.loading=true
    await this.firebaseService.unfollow(this.auth.currentUser?.uid||'', card.user.userid).then((val)=>{
      if(val){
        card.following=false
      }
    })
    card.loading=false
  }

}
