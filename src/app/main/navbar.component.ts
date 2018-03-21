import { AfterViewChecked, Component } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  selector: 'app-navbar',
  animations: [
    trigger('navbarState', [
      state('0', style({
        transform: 'translateY(-100%)'
      })),
      state('1', style({
        transform: 'translateY(0%)'
      })),
      transition('1 => 0', animate(350, keyframes([
        style({transform: 'translateY(10%)', offset: 0.5}),
        style({transform: 'translateY(-100%)', offset: 1})
      ]))),
      transition('0 => 1', animate(350, keyframes([
        style({transform: 'translateY(10%)', offset: 0.5}),
        style({transform: 'translateY(0%)', offset: 1})
      ])))
    ])
  ]
})
export class NavbarComponent implements AfterViewChecked {
  public topOffset = 0;
  public mobileBarOpen = false;

  public entries = [
    {
      name: 'Home',
      routerLink: '/'
    },
    {
      name: 'Über uns',
      routerLink: '/ueber-uns'
    },
    {
      name: 'Medien',
      routerLink: '/medien'
    },
    {
      name: 'Server',
      routerLink: '/server'
    },
    {
      name: 'Forum',
      externalLink: 'https://forum.gruppe-adler.de/'
    },
    {
      name: 'Mitspielen',
      routerLink: '/mitspielen'
    },
    {
      name: 'Wiki',
      externalLink: 'https://wiki.gruppe-adler.de'
    },
    {
      routerLink: '/international',
      imageLink: 'https://www.gruppe-adler.de/wp-content/uploads/ukenglish.jpg'
    }
  ];

  ngAfterViewChecked(): void {
    const wpAdminBar = document.getElementById('wpadminbar');
    if (wpAdminBar) {
      this.topOffset = wpAdminBar.clientHeight;
    }
  }

  onItemClick() {
    this.mobileBarOpen = false;
  }
}
