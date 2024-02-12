import { Timestamp } from "firebase/firestore";

export interface PostData{
  id: string,
  data: string,
  date: Timestamp
}
export class PostData{
  id: string
  data: string
  date: Timestamp
  constructor(){
    this.id=     ''
    this.data=   ''
    this.date=   Timestamp.fromDate(new Date())
  }
}
