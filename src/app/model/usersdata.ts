import { PostData } from "./postdata";
import { SignUpData } from "./signup";
export interface UsersPost{
  id: string,
  posts: PostData[]
}
export class UsersPost{
  id: string;
  posts: PostData[]
  constructor(){
    this.id=''
    this.posts=[]
  }
}

//----------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

export interface UserData{
  userid: string,
  profileImageurl: string,
  details: SignUpData
}
export class UserData{
  userid: string
  profileImageurl: string
  details: SignUpData
  constructor(){
    this. userid=             ''
    this. profileImageurl=    ''
    this. details=            new SignUpData()
  }
}
export interface PostDetails{
  user: UserData,
  post: PostData
}
export class PostDetails{
  user: UserData
  post: PostData
  constructor(){
    this.user=  new UserData()
    this.post=  new PostData()
  }
}
