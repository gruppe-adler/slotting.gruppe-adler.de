import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Post } from './data/post';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from './data/user';
import { Image } from './data/image';
import { Page } from './data/page';

@Injectable()
export class ContentService {

  public currentPage = 0;
  private maxPage = -1;
  public totalItems = -1;

  private currentIndex = 0;
  public posts: Observable<Post[]> = Observable.of([]);
  public cachedUsers: User[] = [];
  private cachedSites: Page[] = [];
  public isLoading = true;

  constructor(private httpClient: HttpClient) {
    this.getPosts();
  }

  public async getPosts(): Promise<Post[]> {
    this.currentPage++;
    if (this.currentPage > this.maxPage && this.maxPage > -1) {
      return null;
    }

    const response = await this.httpClient.get(`${environment.api.baseUrl}/posts?page=${this.currentPage}&per_page=5`, {observe: 'response'}).toPromise();
    this.totalItems = +response.headers.get('X-WP-Total');
    const posts = response.body as Post[];
    this.processPosts(posts);

    Observable
      .forkJoin(this.posts, Observable.of(posts))
      .map(([currentItems, newItems]) => [...currentItems, ...newItems])
      .do(result => {
        this.posts = Observable.of(result);
      }).subscribe();

    this.isLoading = false;

    return this.posts.toPromise();
  }

  private async processPosts(posts: Post[]): Promise<void> {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      post.authors = [];
      post.index = this.currentIndex++;

      for (let j = 0; j < post._links.author.length; j++) {
        this.getUser(post._links.author[j].href).then(result => {
          post.authors.push(result);
        });
      }
    }
  }

  public async getUser(url: string): Promise<User> {
    const userResult = this.cachedUsers.find(cachedUser => cachedUser.link === url);
    if (userResult) {
      return userResult;
    }

    const user = await this.genericRequest<User>(url).toPromise();

    if (user) {
      user.link = url;
      this.getUserPicture(user);
      this.cachedUsers.push(user);
      return user;
    }

    return null;
  }

  public getPreviewImage(id: number): Observable<Image> {
    return this.httpClient.get(`${environment.api.baseUrl}/media/${id}`).map(data => {
      return data as Image;
    }).catch(err => {
      console.log(err);
      return Observable.of(null);
    });
  }

  public async getUserPicture(user: User): Promise<void> {
    try {
      const result = await this.httpClient.get(`${environment.api.forumUrl}/user/${user.name}`).toPromise();
      let picture = result['picture'];
      if (picture.startsWith('/')) {
        picture = 'https://forum.gruppe-adler.de' + picture;
      }
      user.picture = picture;
    } catch (e) {
      console.log(e);
    }
  }

  public getPage(id: number): Observable<Page> {
    const cachedPage = this.cachedSites.find(site => site.id === id);
    if (cachedPage) {
      return Observable.of(cachedPage);
    }

    return this.httpClient.get(`${environment.api.baseUrl}/pages/${id}`).map(data => {
      this.cachedSites.push(data as Page);
      return data as Page;
    }).catch(err => {
      console.log(err);
      return Observable.of(null);
    });
  }

  public genericRequest<T>(url: string): Observable<T> {
    return this.httpClient.get(url).map(data => {
      return data as T;
    }).catch(err => {
      console.log(err);
      return Observable.of(null);
    });
  }
}
