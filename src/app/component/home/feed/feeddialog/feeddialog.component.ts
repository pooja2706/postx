import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-feeddialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './feeddialog.component.html',
  styleUrl: './feeddialog.component.css'
})
export class FeeddialogComponent {
  forms: FormGroup
  db=getFirestore()
  constructor(fb: FormBuilder, private dialogref: MatDialogRef<FeeddialogComponent>){
    this.forms=fb.group({
      data: new FormControl('')
    })
  }
  async onSubmit() {
    const auth=getAuth()
    const docref=await addDoc(collection(this.db, 'users/'+auth.currentUser?.uid+'/posts/'), {
      data: this.forms.controls['data'].value,
      date: Timestamp.fromDate(new Date())
    }).then((value)=>{
      //value.id=id of document that is uploaded
      this.dialogref.close({id: value.id, status: true})
    })
    .catch((err)=>{
      console.log('Error occured');
      this.dialogref.close({id: 'error', status: false})
    })
  }
}
