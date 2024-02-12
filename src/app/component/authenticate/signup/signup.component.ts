import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Router, RouterModule } from '@angular/router';
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { logopath } from '../../../../constants/imagepath';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface SignUpData{
  name: string,
  email: string,
  password: string
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatProgressSpinnerModule
    // BrowserAnimationsModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupform: FormGroup
  signupdata: SignUpData= {name: '',email: '',password: ''};
  db=getFirestore()
  logopath=logopath
  pageloading: boolean=false
  constructor(fb: FormBuilder, private router: Router){
    this.signupform=fb.group({
      name:             new FormControl('pooja',[Validators.required]),
      email:            new FormControl('p@gmail.com',[Validators.required]),
      password:         new FormControl('123456',[Validators.required]),
      confirmpassword:  new FormControl('123456',[Validators.required])
    })
  }

  onSubmit(){
    this.signupdata.name=this.signupform.controls['name'].value
    this.signupdata.email=this.signupform.controls['email'].value
    this.signupdata.password=this.signupform.controls['password'].value
    // console.log(this.signupdata);
    this.signUp()
  }
  signUp(){
    this.pageloading=true
    const auth = getAuth();
    // console.log(auth);

  createUserWithEmailAndPassword(auth, this.signupdata.email, this.signupdata.password)
  .then((userCredential) => {
  //  console.log(userCredential);
   const userRef=doc(this.db, 'users', userCredential.user.uid)
   setDoc(userRef, this.signupdata)
   this.router.navigateByUrl('');
   this.pageloading=false
  })
  .catch((error) => {
    this.pageloading=false
    if(error.code=='auth/invalid-email'){
      alert('Invalid email')
    }
    if(error.code=='auth/weak-password'){
      alert('Weak password')
    }
    if(error.code=='auth/email-already-in-use'){
      alert('auth/email-already-in-use')
    }
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error.code);

  });
  }
  changes(){
    // console.log(this.signupform.value);
  }

  check(): boolean{
    if(this.signupform.controls['password'].value==this.signupform.controls['confirmpassword'].value)
    return true
    return false
  }

}
