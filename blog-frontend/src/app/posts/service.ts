import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Post } from './model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{ message: string; posts: any[] }>(BACKEND_URL)
      .pipe(map(postData => {
        return postData.posts.map(post => ({
          title: post.title,
          content: post.content,
          id: post.id,
          creator: post.creator
        }));
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener = () => this.postsUpdated.asObservable();

  getPost = (id: string) => this.http.get<{ id: string, title: string, content: string, creator: any }>(BACKEND_URL + id);

  addPost(title: string, content: string) {
    const postData = { title, content };
    return this.http.post<{ message: string; postId: string; creator: any }>(
      BACKEND_URL,
      postData
    );
  }

  updatePost(id: string, title: string, content: string) {
    const postData = { title, content };
    return this.http.put(BACKEND_URL + id, postData);
  }

  deletePost = (postId: string) => this.http.delete(BACKEND_URL + postId);
}