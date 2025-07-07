import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Post } from '../model';
import { PostsService } from '../service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreateComponent implements OnInit {
  post!: Post;
  isLoading = false;
  mode = 'create';
  private postId: string | null = null;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) { }

ngOnInit() {
  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has('postId')) {
      this.mode = 'edit';
      this.postId = paramMap.get('postId')!;
      this.isLoading = true;
      this.postsService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {
          id: postData.id,
          title: postData.title,
          content: postData.content,
          creator: postData.creator
        };
      });
    } else {
      this.mode = 'create';
      this.postId = null;
      this.post = { id: '', title: '', content: '', creator: { _id: '', email: '' } };
    }
  });
}
onSavePost(form: NgForm) {
  if (form.invalid) {
    return;
  }
  this.isLoading = true;
  if (this.mode === 'create') {
    this.postsService.addPost(form.value.title, form.value.content).subscribe({
      next: () => {
        this.snackBar.open('Post created successfully!', 'OK', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.isLoading = false;
      }
    });
  } else {
    this.postsService.updatePost(this.postId!, form.value.title, form.value.content).subscribe({
      next: () => {
        this.snackBar.open('Post updated successfully!', 'OK', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.isLoading = false;
      }
    });
  }
}
}