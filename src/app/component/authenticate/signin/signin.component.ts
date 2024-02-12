import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { logopath } from '../../../../constants/imagepath';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatProgressSpinner
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signinform: FormGroup
  logopath=logopath
  pageloading: boolean=false;
  constructor(fb: FormBuilder, private router: Router){
    this.signinform=fb.group({
      email:    new FormControl('p@gmail.com', [Validators.required]),
      password: new FormControl('123456', [Validators.required])
    })
  }
  signIn(){
    this.pageloading=true
    signInWithEmailAndPassword(getAuth(),this.signinform.controls['email'].value, this.signinform.controls['password'].value).then((res)=>{
      // console.log(res);
      console.log('Login successful');
      this.router.navigateByUrl('')
      // console.log(getAuth());
      this.pageloading=false
    })
    .catch((err)=>{
      if(err.code=='auth/invalid-credential'){
        alert('Invalid credential')

      }
      // console.log(err);
      this.pageloading=false

    })
  }
}
