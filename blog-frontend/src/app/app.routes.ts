import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list';
import { PostCreateComponent } from './posts/post-create/post-create';
import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { authGuard } from './auth/guard';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [authGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];