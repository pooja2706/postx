import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { getAuth } from 'firebase/auth';
import { FirebasesdataService } from '../../../service/firebasesdata.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { UserData } from '../../../model/usersdata';


interface User{
  userdata: UserData
  loading: boolean,
  following: boolean
  followers: number
}
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  userid: string[]=[]
  auth
  users: User[]=[]
  pageloading:boolean=false;
  logopath: string=''
  constructor(private firebasedata: FirebasesdataService)
  {
    this.pageloading=true

    this.auth=getAuth()
    this.getallusers().then(()=>{
      // console.log('activated');
    })
  }

  async getallusers(){
    this.userid=[];
    this.users=[]
    // console.log('here');

    this.userid= await this.firebasedata.getalluserid('users')
    // console.log('here');

    this.userid.splice(this.userid.indexOf(this.auth.currentUser?.uid||''), 1)

    this.userid.forEach(async(id)=>{
      // console.log('here');

      await this.firebasedata.checkfollowing(this.auth.currentUser?.uid||'', id).then(async (value)=>{
        // const username=await this.firebasedata.getfieldData('users/'+id, 'name')
    // console.log('here');

          const userdetails: UserData=await this.firebasedata.getUserDetails(id)
          // console.log('here');

          const followinglist: []=await this.firebasedata.getfieldData('users/'+id, 'followers');
          // console.log('here');

        if(value){
          let length=0;
          if(followinglist==undefined){
            length=0
          }
          else{
            length=followinglist.length
          }
          this.users.push({userdata: userdetails, loading: false, following: true, followers: length})
        }
        else{
          let length=0;
          if(followinglist==undefined){
            length=0
          }
          else{
            length=followinglist.length
          }
          this.users.push({userdata: userdetails, loading: false, following: false, followers: length})
        }
        // console.log('here');
      })
    })
    // this.pageloading=false

    // console.log('here');


  }
  // Follow='Follow'
  async follow(user: User){
    user.loading=true
    await this.firebasedata.follow(this.auth.currentUser?.uid||'', user.userdata.userid).then(async (val)=>{
      if(val){
        await this.firebasedata.getfieldData('users/'+this.auth.currentUser?.uid, 'following').then((value)=>{
          const followingarray=value;
          if(followingarray.includes(user.userdata.userid)){
            user.following=true
          }
          else{
            user.following=false
          }
        })
        user.following=true
        user.loading=false
    // this.Follow='Follow'

      }
      else{
        user.following=false
      }
    })
    await this.checkFollowing(user)

  }
  // checkfoll: boolean=false
  async checkFollowing(user: User){
    await this.firebasedata.checkfollowing(this.auth.currentUser?.uid||'', user.userdata.userid).then((val)=>{
      if(val){
        user.following=true
      }
      else{
        user.following=false
      }
    })
    return false
  }
  async unfollow(user: User){
    user.loading=true;
    await this.firebasedata.unfollow(this.auth.currentUser?.uid||'', user.userdata.userid).then(async (val)=>{
      console.log(val);
      if(val){
        await this.firebasedata.getfieldData('users/'+this.auth.currentUser?.uid, 'following').then((value)=>{
          const followingarray=value;
          if(followingarray.includes(user.userdata.userid)){
            user.following=true
            user.loading=false

          }
          else{
            user.following=false
            user.loading=false
          }
        })
      }
      else{
        user.following=true
        user.loading=false

      }
    })

  }
  setLoadingState(state: boolean){
    this.pageloading=state
  }

}
