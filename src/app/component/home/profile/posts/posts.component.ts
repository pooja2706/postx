import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { getAuth } from 'firebase/auth';
import { PostData } from '../../../../model/postdata';
import { FirebasesdataService } from '../../../../service/firebasesdata.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {
  auth
  posts: PostData[]=[]
  name: string=''
  imageurl=''
  pageloading: boolean=true
  constructor(private firebaseservice: FirebasesdataService){
    this.auth=getAuth();
    this.auth.onAuthStateChanged((user)=>{
      firebaseservice.getfieldData("users/"+this.auth.currentUser?.uid, "name").then((val)=>{
        this.name=val
      })
    })
    this.getMyPosts()
    this.checkProfileImage()
  }
  getMyPosts(){
    this.firebaseservice.getPostsofOneUser(this.auth.currentUser?.uid||'').then((val)=>{
      this.posts=val
      // console.log(this.posts);
      // console.log(val);
      this.pageloading=false
    })
  }
  checkProfileImage(){
    this.firebaseservice.getfieldData("users/"+this.auth.currentUser?.uid, "profileImage").then((val)=>{
      if(val)
      this.imageurl=val
      // console.log(this.imageurl);

    })
  }
}
