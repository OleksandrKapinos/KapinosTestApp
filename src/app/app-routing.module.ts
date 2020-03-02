import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';


const routes: Routes = [
  { path:  '', redirectTo: '/users', pathMatch: 'full'},
  { path: 'users', component: UsersComponent},
  { path: 'posts', component: PostsComponent},
  { path: 'post/:id', component: PostComponent},
  { path: '**', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
