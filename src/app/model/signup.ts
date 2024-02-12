export interface SignUpData{
  name: string,
  email: string,
  password: string
}
export class SignUpData{
  name: string
  email: string
  password: string
  constructor(){
  this.name     =     '',
  this.email    =     '',
  this.password =     ''
  }
}
