import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getDocs, getFirestore, query, Timestamp, updateDoc } from 'firebase/firestore';
import { stringify } from 'querystring';
import { PostData } from '../model/postdata';
import { PostDetails, UserData, UsersPost } from '../model/usersdata';
@Injectable({
  providedIn: 'root'
})
export class FirebasesdataService {
  db
  postdata: PostData[]=[]
  // auth
  constructor() {
   this.db = getFirestore()
    // auth=getAuth
   }

  async getPosts(path: string): Promise<PostData[]>{
    this.postdata=[]
    const docsref=await getDocs(query(collection(this.db, path)))
    docsref.forEach(async (doc)=>{
      this.postdata.push({id: doc.id, data: await doc.get('data'), date: await doc.get('date')})
    })
    const documents=docsref.docs
    // console.log(this.postdata);
    const allposts=await this.getAllDocuments(path)
    // console.log(allposts);

    return this.postdata
  }

  async getPostDetail(userid: string[]){
    const postdetails: PostDetails[]=[];
    // console.log(userid);

    userid.forEach(async (id)=>{
      // console.log(id);

      await this.getUserDetails(id).then(async (userdata)=>{
        // let allposts: string[]=[];
        await this.getAllDocuments('users/'+id+'/posts/').then(async (eachpost)=>{
          // allposts=eachpost
          // console.log(eachpost);

          eachpost.forEach(async (post)=>{
            const postdata=await this.getPostData(id, post)
            postdetails.push({user: userdata, post: postdata})
          })
          // console.log(eachpost);

        })
      })
    })

    // console.log(userdata);
    // console.log(postdetails);
//


    return postdetails


    // const postdata=await this.getPostData(userid)
  }

  async getUserDetails(userid: string) {
    // console.log(userid);

    const userdata: UserData={userid: '', profileImageurl: '', details: {email: '', password: '', name: ''}}
    // await (await this.getPosts(''))
    await this.getdocument('users/'+userid).then(async (userdetail)=>{
      userdata.userid=userid;
      // console.log(userid);

      const profileimage=await userdetail.get('profileImage')
      // console.log('38');

      userdata.profileImageurl=   await ((profileimage==undefined|| profileimage=='')?'not selected': profileimage)
      userdata.details.email=     await userdetail.get('email')
      // console.log('38');

      userdata.details.password=  await userdetail.get('password')
      userdata.details.name=      await userdetail.get('name')
      // console.log('wesdfghj');

    }).then(()=>{
      // console.log('inuserdetails');


    })
    // console.log(54);

    return userdata

  }

  async getPostData(userid: string, postid: string): Promise<PostData>{
    const postdata: PostData={id: '', data: '', date: Timestamp.fromDate(new Date())};
    await this.getdocument('users/'+userid+'/posts/'+postid).then(async (detail)=>{
      postdata.id=postid;
      postdata.data=await detail.get('data');
      postdata.date=await detail.get('date')
    })
    return postdata
  }

  async getAllPostsByUserId(): Promise<PostDetails[]>{
    const userposts: PostDetails[]=[]

    await this.getAllDocuments('users/').then(async (value)=>{  //for every user
      value.forEach(async (userid)=>{
        let curruserdata: UserData={userid: '', profileImageurl: '', details: {email: '', password: '', name: ''}} //get user details
        curruserdata=await this.getUserDetails(userid)
        await this.getAllDocuments('users/'+userid+'/posts').then( async (id)=>{
          id.forEach( async (postid)=>{
            await this.getPostData(userid, postid).then((currpost)=>{
              userposts.push({user: curruserdata, post: currpost})
            })
          })
        })
      })
    })

    return userposts;
  }

  async getAllDocuments(path: string): Promise<string[]>{
    const documents:string[]=[];
    // console.log(path);

    const docref=await getDocs(query(collection(this.db, path)));
    // console.log(docref);

    docref.forEach((doc)=>{
      documents.push(doc.id)
      // console.log('completed');

    })
    // console.log(documents);
    return documents

  }
  idarray: string[]=[]
  // async getPostsFromSpecificUsers(usersid: string[]): Promise<PostDetails>{

  // }

  // async getPostsFromSpecificUsers(usersid: string[]): Promise<UsersPost[]>{
  //   const posts: UsersPost[]=[]
  //   usersid.forEach(async (userid)=>{
  //     await this.getPosts(userid).then((data)=>{
  //       posts.push({id: userid, posts: data})
  //     })
  //   })
  //   return posts
  // }

  async getPostsofOneUser(userid: string): Promise<PostData[]>{
    let posts: PostData[]=[]
    await this.getPosts("users/"+userid+"/posts").then((val)=>{
      posts=val
    })
    return posts
  }

  async getalluserid(path: string): Promise<string[]> {
    this.idarray=[]
    const idref=await getDocs(query(collection(this.db, path)));
    idref.forEach((doc)=>{
      this.idarray.push(doc.id)
    })
    return this.idarray;
  }

  async getfieldData(docpath: string, fieldname: string){

    const documentref=await this.getdocument(docpath);
    if(documentref){
      return await documentref.get(fieldname)
    }
    else{
      return null
    }
  }

  async getdocument(docpath: string): Promise<DocumentSnapshot<DocumentData, DocumentData>>{

    const docref=  await getDoc(doc(this.db, docpath))

    return docref
  }
  getdocumentref(docpath: string){
    return doc(this.db, docpath)
  }

  async follow(currid: string, followid: string): Promise<boolean>{
    let curridfollowinglist=await this.getfieldData('users/'+currid, 'following')
    if(curridfollowinglist){
      if(!curridfollowinglist.includes(followid))
      curridfollowinglist.push(followid)
    }
    else{
      // if(curridfollowinglist)
      // curridfollowinglist: []
      curridfollowinglist=[]
      curridfollowinglist.push(followid)
    }

    let followingididfollowinglist=await this.getfieldData('users/'+followid, 'followers')
    if(followingididfollowinglist){
      if(!followingididfollowinglist.includes(currid))
      followingididfollowinglist.push(currid)
    }
    else{
      followingididfollowinglist= []
      followingididfollowinglist.push(currid)
    }
    let checkcurr: boolean=false, checkfoll: boolean=false
    await this.updatefield('users/'+currid, "following", curridfollowinglist).then(()=>{
      checkcurr=true
    })
    .catch((err)=>{
      checkcurr=false
    })
    await this.updatefield('users/'+followid, "followers", followingididfollowinglist).then(()=>{
      checkfoll=true
    })
    .catch((err)=>{
      checkfoll=false
    })

    return (checkcurr&&checkfoll)


  }

  async updatefield(docpath: string, fieldname: string, updatedvalue: any){
    // console.log(updatedvalue);

    const docref=this.getdocumentref(docpath);
    const fieldvalue=await this.getfieldData(docpath, fieldname);
    await updateDoc(docref, {
      [fieldname]: updatedvalue
    })
  }

  async checkfollowing(currid: string, followid: string): Promise<boolean>{
    const followinglist=await this.getfieldData('users/'+currid, 'following');
    if(followinglist){
    if(followinglist.includes(followid)){
      return true
    }
    else{
      return false
    }
  }
  else{
    return false
  }
  }

  async unfollow(currid: string, followid: string){
    let curridfollowinglist=await this.getfieldData('users/'+currid, 'following')
    if(curridfollowinglist){
      if(curridfollowinglist.includes(followid)){
        curridfollowinglist.splice(curridfollowinglist.indexOf(currid), 1)
        // console.log(curridfollowinglist);

      }

    }

    let followingididfollowinglist=await this.getfieldData('users/'+followid, 'followers')
    if(followingididfollowinglist){
      if(followingididfollowinglist.includes(currid))
      followingididfollowinglist.splice(followingididfollowinglist.indexOf(followid), 1)
    }
    else{
      // followingididfollowinglist= []
      // followingididfollowinglist.push(currid)
    }
    let checkcurr: boolean=false, checkfoll: boolean=false
    await this.updatefield('users/'+currid, "following", curridfollowinglist).then(()=>{
      checkcurr=true
    })
    .catch((err)=>{
      checkcurr=false
    })
    await this.updatefield('users/'+followid, "followers", followingididfollowinglist).then(()=>{
      checkfoll=true
    })
    .catch((err)=>{
      checkfoll=false
    })

    return (checkcurr&&checkfoll)
  }

  async countDocuments(path: string){
    const id: string[]=await this.getAllDocuments(path)

    let count=0;
    id.forEach((val)=>{
      count++
    })
    return count
  }

  async countArrayFieldElements(path: string, field: string){
    const fielddata: []=await this.getfieldData(path, field)
    let count=0;
    fielddata.forEach((val)=>{
      count++
    })

    return count
  }
}
