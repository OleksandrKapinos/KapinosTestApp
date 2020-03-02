import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private  http: HttpClient
  ) {}

  getUserPosts(id: number) {
    return this.http.get<any>(`${environment.production}/posts?userId=${id}`);
  }

  getPost(id: number) {
    return this.http.get<any>(`${environment.production}/posts/${id}`);
  }

  addPost(body) {
    return this.http.post<any>(`${environment.production}/posts`, body);
  }

  editPost(body) {
    const { id } = body;
    return this.http.put<any>(`${environment.production}/posts/${id}`, body);
  }

  deletePost(id: number) {
    return this.http.delete<any>(`${environment.production}/posts/${id}`);
  }
}
