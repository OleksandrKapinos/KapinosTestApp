import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private  http: HttpClient
  ) {}

  getPostComments(id: number) {
    return this.http.get<any>(`${environment.production}/comments?postId=${id}`);
  }
}
