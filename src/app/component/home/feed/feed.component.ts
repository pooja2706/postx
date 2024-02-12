import { CommonModule, DatePipe, Time } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { async } from '@firebase/util';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore';
import { timestamp } from 'rxjs';
import { setTimeout } from 'timers';
// import { setTimeout } from 'timers/promises';
import { PostData } from '../../../model/postdata';
import { PostDetails, UserData, UsersPost } from '../../../model/usersdata';
import { FirebasesdataService } from '../../../service/firebasesdata.service';
import { UsersComponent } from '../users/users.component';
import { FeeddialogComponent } from './feeddialog/feeddialog.component';

export interface Posts{
  id: string,
  post: PostDetails,
  timestamp: string
}
// export inter
@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    UsersComponent
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent {
  // postdata: PostData[]=[]
  // userdata: UserData={userid: '', profileImageurl: '', details: {email: '', password: '', name: ''}}
  userid: string[]=[];
  auth
  db=getFirestore();
  postDetails=new PostDetails()
  posts: PostDetails[]=[]
  loading: boolean=false
  cardDetails: Posts[]=[]
  followerslist: boolean=false

  constructor(private dialog: MatDialog, private firebasedata: FirebasesdataService, router: Router){
    // this.loading=true
    this.auth=getAuth()
    this.auth.onAuthStateChanged((user)=>{
      if(user){
        this.loading=false
        // this.showLoading()
        this.getSomePostUser()
      }
      else{
        router.navigateByUrl('login')
      }
    })


  }

  // async getAllPostsUserId(){
  //   await this.firebasedata.getAllPostsByUserId().then(async (val)=>{
  //     this.posts=await val
  //     console.log(this.posts.length);
  //   })
  //   // console.log(this.cardDetails);

  // }
  usersclicked: boolean=false
  setusersclicked(state: boolean){
    this.usersclicked=true
  }
  setpost(post: PostDetails[]){
    this.posts.concat(post)
    // console.log(this.posts);

  }
  async getSomePostUser(){
    // this.sortstate=false
    const allfollowers: string[]=await this.firebasedata.getfieldData('users/'+this.auth.currentUser?.uid, 'following').catch((err)=>{
      console.log(err);
      this.followerslist=false
    })
    if(allfollowers){
      this.followerslist=true
      // console.log(allfollowers);
      allfollowers.push(this.auth.currentUser?.uid||'')
      this.posts=[]
      await this.firebasedata.getPostDetail(allfollowers).then((postdet)=>{
      // console.log(postdet);
      this.posts=postdet
    })
    }
    else{
      this.followerslist=false
      console.log('You do not follow anyone');

    }


    // allfollowers.forEach(
    //   async (val)=>
    //   {
    //     const newpost=this.posts
    //     let postdetails: PostDetails[]=[]
    //     await this.firebasedata.getPostDetail(val).then(async (val)=>{
    //       if(val){
    //         console.log(val);
    //         this.setpost(val)
    //       }
    //       console.log(val.values().next());
    //       this.setpost(val)
    //       this.posts=this.posts.concat(val)
    //       console.log(postdetails);

    //     })
    //     console.log(val);

    //     this.posts=this.posts.concat(postdetails)
    //     console.log(newpost);
    //     console.log(this.posts);


    //   },
    //   )
      // console.log(this.cardDetails);

  }

  opendialog(){
    const dialogref=this.dialog.open(FeeddialogComponent, {
      data: null
    })
    dialogref.afterClosed().subscribe(async(res)=>{
      if(res.status){

        const updateddoc=await getDoc(doc(this.db, 'users/'+this.auth.currentUser?.uid+'/posts/'+res.id))
        // this.postdata.push({id: res, data: updateddoc.get('data'), date: updateddoc.get('date')})
        // console.log(this.postdata);
        const userdata: UserData=await this.firebasedata.getUserDetails(this.auth.currentUser?.uid||'')
        const postdatanew: PostData=await this.firebasedata.getPostData(this.auth.currentUser?.uid||'', res.id)
        this.posts.push({user: userdata, post: postdatanew})
        // console.log(this.posts);

        this.sortDates(this.posts)
      }
      else{
        console.log('error occured');

      }

    })
  }
  convertToCardDetails(post: PostDetails[]){
    // console.log(post);

    post.forEach((value)=>{
      // console.log('dfghjk');

      this.cardDetails.push({id: value.post.id, post: value, timestamp:''})
    })
    // console.log(this.cardDetails);

  }
  // sortstate: boolean=false

  sortDates(posts: PostDetails[]){
    // console.log(posts);
    this.cardDetails=[]
    this.convertToCardDetails(this.posts)
    // console.log(new Date(timestamp.seconds*1000))
    this.cardDetails.sort(
      (a, b) => {
        return new Date(b.post.post.date.seconds*1000).getTime()-new Date(a.post.post.date.seconds*1000).getTime()
      });

    this.cardDetails.forEach((value)=>{
      value.timestamp=this.timeDifference(new Date().getTime(), new Date(value.post.post.date.seconds*1000).getTime()  )
    })
    // console.log(this.posts);
    // console.log(this.cardDetails);

  }
  timeDifference(current: number, previous: number) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';
    }
}
  getTimestamp(postdetails: PostDetails){
    const result=this.cardDetails.find((value)=>{
      return value.id===postdetails.post.id
    })
    // console.log(result);
    return result?.timestamp

  }
  pushpost(post: PostDetails[]){
    // console.log(post);
  }
  setLoadingState(state: boolean){
    this.loading=state
  }


}
