import { Component } from '@angular/core';
import { StorageService } from './storage.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

declare const ga: Function;

@Component({
  selector: 'app-storage-notification',
  templateUrl: './storage-notification.component.html',
  styleUrls: ['./storage-notification.component.scss'],
  animations: [
    trigger('messageState', [
      state('1', style({
        transform: 'translateY(100%)'
      })),
      state('0', style({
        transform: 'translateY(0%)'
      })),
      transition('0 => 1', animate(200, keyframes([
        style({transform: 'translateY(100%)', offset: 1})
      ]))),
      transition('1 => 0', animate(200, keyframes([
        style({transform: 'translateY(0%)', offset: 1})
      ])))
    ])
  ]
})
export class StorageNotificationComponent {
  messageSuppressed = true;

  constructor(private storageService: StorageService) {
    window.setTimeout(() => {
      this.messageSuppressed = storageService.isLocalStorageAccepted();
    }, 500);

    storageService.acceptStatusChanged.subscribe(accepted => {
      if (!accepted) {
        this.messageSuppressed = false;
      }
    });
  }

  onAcceptButtonClicked() {
    this.messageSuppressed = true;
    this.storageService.setLocalStorageAccepted(true);
    ga('send', 'event', 'Storage', 'accepted', '', 'true');
  }

  onDisagreeButtonClicked() {
    this.messageSuppressed = true;
    ga('send', 'event', 'Storage', 'accepted', '', 'false');
  }
}
