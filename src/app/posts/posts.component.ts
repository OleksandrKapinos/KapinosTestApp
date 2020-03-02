import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../_services/posts.service';
import { ModalService } from '../_services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  userId: number;
  isSending: boolean;
  sendStatus: string;
  postForm;
  isLoading: boolean;
  isEmptyContainer: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      this.userId = +params.userId;
      this.postsService.getUserPosts(this.userId)
        .subscribe(posts => {
          if (posts.length) {
            this.posts = posts;
          }
          this.isLoading = false;
        },
          () => {
            this.isLoading = false;
            this.isEmptyContainer = true;
          }
        );
    });

    this.postForm = this.fb.group({
      title: ['', [Validators.minLength(7), Validators.required]],
      body: ['', [Validators.minLength(14), Validators.required]]
    });
  }

  submitPost() {
    this.isSending = true;
    const { valid, value } = this.postForm;

    if (!valid) {
      this.isSending = false;
      return;
    }

    const sendData = Object.assign(value, { userId: this.userId });

    this.postsService.addPost(sendData)
      .subscribe(
        () => {
          this.postForm.reset();
          this.isSending = false;
          this.sendStatus = 'success';
          this.postsService.getUserPosts(this.userId)
            .subscribe(posts => {
                if (posts.length) {
                  this.posts = posts;
                }
                this.isLoading = false;
              },
              () => {
                this.isLoading = false;
                this.isEmptyContainer = true;
              }
            );
        },
        () => {
          this.isSending = false;
          this.sendStatus = 'error';
        }
      );
  }

  goToPost(id) {
    this.router.navigate(['/post', id]);
  }

  openModal(id: string) {
    this.sendStatus = '';
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
