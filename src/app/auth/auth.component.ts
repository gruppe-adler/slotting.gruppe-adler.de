import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  public constructor(private authService: AuthService) {
  }

  public ngOnInit(): void {
    if (this.authService.authInProgress()) {
      this.authService.postToSlotlistBackend();
    }
  }

  public startAuthentication(): void {
    this.authService.goToAuth();
  }

  public getAuthToken(): string {
    return this.authService.getAuthToken() || '';
  }
}
