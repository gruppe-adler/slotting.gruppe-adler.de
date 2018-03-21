import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Post } from './data/post';
import { MatDialog } from '@angular/material';
import { LightboxComponent } from './lightbox.component';

@Component({
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  selector: 'app-content-post'
})
export class PostComponent implements AfterViewInit {
  @Input() post: Post;
  @Input() expanded = false;

  constructor(private elementRef: ElementRef, private dialog: MatDialog) {}

  public navigateToUser(user: string) {
    window.location.href = `https://forum.gruppe-adler.de/user/${user}`;
  }

  public authorsValid(): boolean {
    return this.post.authors.filter(value => {
      return value && value.name;
    }).length > 0;
  }

  ngAfterViewInit(): void {
    this.addLightboxAction();
    this.setIframeClasses();
  }

  private addLightboxAction(): void {
    this.elementRef.nativeElement.querySelectorAll('img').forEach(current => {
      current.parentElement.removeAttribute('href');
      current.addEventListener('click', () => {
        this.showLightbox(current.getAttribute('src'));
      });
    });
  }

  private setIframeClasses(): void {
    this.elementRef.nativeElement.querySelectorAll('iframe').forEach(current => {
      current.parentElement.classList.add('iframe-wrapper');
    });
  }

  private showLightbox(url: string): void {
    this.dialog.open(LightboxComponent, { data: url });
  }
}
