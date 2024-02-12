import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { getAuth, User } from 'firebase/auth';
import { PostData } from '../../../model/postdata';
import { FirebasesdataService } from '../../../service/firebasesdata.service';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { count } from 'console';
import { Router, RouterModule } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

interface elementcount{
  posts: number,
  followers: number,
  following: number
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    PostsComponent,
    FollowersComponent,
    FollowingComponent,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup
  auth
  // user: string=''
  posts: PostData[]=[]
  name: string=''
  storage=getStorage()
  countData: elementcount={posts:0, followers: 0, following: 0}
  constructor(private firebaseservice: FirebasesdataService, fb: FormBuilder, private router: Router){
    this.profileForm=fb.group({
      image: new FormControl(Image),
      username: new FormControl('')
    })
    this.auth=getAuth();
    this.auth.onAuthStateChanged((user)=>{
      firebaseservice.getfieldData("users/"+this.auth.currentUser?.uid, "name").then((val)=>{
        this.name=val
      })
    })

    firebaseservice.countArrayFieldElements('users/'+this.auth.currentUser?.uid, 'followers').then((val)=>{
      this.countData.followers=val
    })
    firebaseservice.countArrayFieldElements('users/'+this.auth.currentUser?.uid, 'following').then((val)=>{
      this.countData.following=val
    })
    firebaseservice.countDocuments('users/'+this.auth.currentUser?.uid+'/posts').then((val)=>{
      this.countData.posts=val
    })

    // this.getMyPosts()
    this.checkProfileImage()
    this.poststate=true
  }
  // getMyPosts(){
  //   this.firebaseservice.getPostsofOneUser(this.auth.currentUser?.uid||'').then((val)=>{
  //     this.posts=val
  //     console.log(this.posts);
  //     console.log(val);
  //   })
  // }

  choosefile(event: any){
    // console.log(event);
    const path=event.target.files[0]
    this.uploadimage(path)
  }

  uploadimage(path: any){
    // console.log(path);
    const storageref=ref(this.storage, "profile/"+this.auth.currentUser?.uid)
    uploadBytes(storageref, path).then(async (snapshot) => {
      // let imageurl=''
      await getDownloadURL(snapshot.ref).then((val)=>{
        this.imageurl=val
        // console.log(this.imageurl);

      })
      // console.log(this.imageurl);

      this.firebaseservice.updatefield("users/"+this.auth.currentUser?.uid, "profileImage", this.imageurl)
      console.log('Uploaded a blob or file!');
    });

  }
  imageurl: string='not selected'

  checkProfileImage(){
    this.firebaseservice.getfieldData("users/"+this.auth.currentUser?.uid, "profileImage").then((val)=>{
      if(val)
      this.imageurl=val
      console.log(this.imageurl);

    })
  }
  poststate: boolean=false;
  followerstate: boolean=false;
  followingstate: boolean=false
  checkPosts(){
    this.poststate=true;
    this.followerstate=false;
    this.followingstate=false
  }

  checkFollowers(){
    this.followerstate=true
    this.poststate=false
    this.followingstate=false
  }

  checkFollowing(){
    this.followingstate=true
    this.poststate=false;
    this.followerstate=false
  }
  signout(){
    this.auth.signOut().then(()=>{
      this.router.navigateByUrl('login')
    })
  }


}
