import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signinform: FormGroup
  constructor(fb: FormBuilder){
    this.signinform=fb.group({
      email:    new FormControl('p@gmail.com', [Validators.required]),
      password: new FormControl('123456', [Validators.required])
    })
  }
  signIn(){
    signInWithEmailAndPassword(getAuth(),this.signinform.controls['email'].value, this.signinform.controls['password'].value).then((res)=>{
      console.log(res);
      console.log('Login successful');
      console.log(getAuth());


    })
  }
}
