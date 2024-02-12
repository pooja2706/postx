import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SigninComponent } from './component/authenticate/signin/signin.component';
import { SignupComponent } from './component/authenticate/signup/signup.component';
import { FeedComponent } from './component/home/feed/feed.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
  {path: '',        component: HomeComponent},
  {path: 'signup',  component: SignupComponent},
  {path: 'login',   component: SigninComponent},
  // {path: 'feed',    component: FeedComponent}
];
