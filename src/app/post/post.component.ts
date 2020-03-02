import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PostsService } from '../_services/posts.service';
import { CommentsService } from '../_services/comments.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../_services/modal.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postInfo: any = {};
  postComments: any = [];
  isLoadingPost: boolean;
  isLoadingComments: boolean;
  isSending: boolean;
  isDeleting: boolean;
  sendStatus: string;
  editForm;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private location: Location
  ) {}

  ngOnInit() {
    this.isLoadingPost = true;
    this.isLoadingComments = true;

    this.editForm = this.fb.group({
      title: ['', [Validators.minLength(7), Validators.required]],
      body: ['', [Validators.minLength(14), Validators.required]]
    });

    this.route.params.subscribe(
      params => {
        const id = +params.id;
        this.postsService.getPost(id)
          .subscribe(post => {
            if (post) {
              this.postInfo = post;
            }
            this.isLoadingPost = false;
          });
        this.commentsService.getPostComments(id)
          .subscribe(comments => {
            if (comments.length) {
              this.postComments = comments;
            }
            this.isLoadingComments = false;
          });
    });

  }

  submitPost() {
    this.isSending = true;
    const { valid, value } = this.editForm;

    if (!valid) {
      this.isSending = false;
      return;
    }

    const sendData = Object.assign(value, { userId: this.postInfo.userId,  id: this.postInfo.id });

    this.postsService.editPost(sendData)
      .subscribe(
        () => {
          this.editForm.reset();
          this.isSending = false;
          this.sendStatus = 'success';
          this.postsService.getPost(this.postInfo.id)
            .subscribe(post => {
              if (post) {
                this.postInfo = post;
              }
            });
        },
        () => {
          this.isSending = false;
          this.sendStatus = 'error';
        }
      );
  }

  deletePost() {
    this.isDeleting = true;
    const { id } = this.postInfo;
    this.postsService.deletePost(id)
      .subscribe(
        () => {
          this.isDeleting = false;
          this.location.back();
        },
        () => {
          this.closeModal('delete-post');
        }
      );
  }

  openModal(id: string) {
    const { title, body } = this.postInfo;
    this.editForm.patchValue({ title, body });
    this.sendStatus = '';
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
