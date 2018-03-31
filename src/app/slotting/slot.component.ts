import { Component, Input, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { SharedService } from './shared/shared.service';
import { MatDialog } from '@angular/material';
import { NameDialogComponent } from './shared/name-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { SlottingService } from './slotting.service';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
  selector: 'app-event-slot'
})
export class SlotComponent implements OnInit {
  public static slottingInProgress = false;

  @Input() slot: any;
  @Input() isFireteam = false;
  @Input() matchid = '';
  @Input() reservation = '';
  public background: string;
  public slotTooltip: string;
  public slotLocked = false;
  public showGroupColors = false;

  constructor(private notificationsService: NotificationsService,
              public sharedService: SharedService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              public slottingService: SlottingService) {
  }

  public ngOnInit(): void {
    if (this.slot['reserved-for'] && this.slot['reserved-for'] !== '') {
      this.reservation = this.slot['reserved-for'];
    }

    this.sharedService.slotChanged.subscribe(data => {
      if (data.uuid === this.slot.uuid) {
        console.log('updated slot', data);
        this.slot = data;
        this.parseProfilePicture();
        this.updateBackground();
      }
    });
    this.sharedService.slots.push(this.slot);

    this.parseProfilePicture();
    this.updateBackground();

    if (this.sharedService.shareData) {
      if (this.reservation && this.reservation !== this.sharedService.shareData.reservation) {
        this.slotTooltip = this.reservation;
      } else if (!this.reservation) {
        this.slotTooltip = 'Gruppe Adler';
      }
    } else if (this.reservation) {
      this.slotTooltip = this.reservation;
    }

    if (!this.sharedService.shareData) {
      this.showGroupColors = localStorage.getItem(environment.storageKeys.showGroupColor) === 'true';
      this.slottingService.showGroupsChanged.subscribe(value => this.showGroupColors = value);
    }
  }

  /**
   * Parses the profile picture and adds the forum url as a prefix if needed
   */
  private parseProfilePicture(): void {
    if (this.slot.user && this.slot.user.picture && !this.slot.user.picture.startsWith('http')) {
      this.slot.user.picture = 'https://forum.gruppe-adler.de' + this.slot.user.picture;
    }
  }

  /**
   * Updates the background picture for the slot
   */
  private updateBackground(): void {
    if (this.slot.user) {
      this.background = this.slot.user.picture ? `url('${this.slot.user.picture}')` : this.slot.user['icon:bgColor'];
    } else {
      this.background = null;
    }
    if (this.sharedService.shareData) {
      this.updateBackgroundShared();
    } else {
      this.slotLocked = this.reservation && this.reservation !== '' && !this.slot.user;
    }
  }

  private updateBackgroundShared(): void {
    this.slotLocked = (!this.slot.user || (this.slot.user && !this.slot.user['icon:text'])) && this.sharedService.shareData.reservation !== this.reservation;
  }

  /**
   * Called in template when user clicks on a slot
   */
  public async slotUser(): Promise<void> {
    if (this.sharedService.shareData) {
      await this.slotUserShared();
    } else {
      if (SlotComponent.slottingInProgress) {
        return;
      }
      if (this.slot.user && this.slot.user.uid.toString() === await this.slottingService.getOwnUserId()) {
        await this.deleteUser();
      } else {
        await this.slotUserInternal();
      }
    }
  }

  /**
   * Called when slotlist is shared event
   * @returns {Promise<void>}
   */
  private async slotUserShared(): Promise<void> {
    // Check if slot reservation is matching the shared reservation
    if (!this.reservation || this.reservation !== this.sharedService.shareData.reservation) {
      const heading = await this.translateService.get('events.notification.not-shared.heading').toPromise();
      const body = await this.translateService.get('events.notification.not-shared.body').toPromise();
      this.notificationsService.error(heading, body);
      return;
    }

    console.log(this.slot.user, this.sharedService.shareData.adminUuid, this.sharedService.currentSelectedSlot);

    // Check if not admin and if slot is already taken
    if (this.slot.user && !this.sharedService.shareData.adminUuid && (this.slot !== this.sharedService.currentSelectedSlot)) {
      const heading = await this.translateService.get('events.notification.no-unslot.heading').toPromise();
      const body = await this.translateService.get('events.notification.no-unslot.body').toPromise();
      this.notificationsService.warn(heading, body);
      return;
    } else if (this.slot.user && (this.sharedService.shareData.adminUuid || this.sharedService.currentSelectedSlot && this.sharedService.currentSelectedSlot === this.slot)) {
      this.deleteUser();
      return;
    }

    const dialogRef = this.dialog.open(NameDialogComponent, {
      data: this.sharedService.currentSelectedSlot ? this.sharedService.currentSelectedSlot.user.username : ''
    });
    dialogRef.afterClosed().subscribe(async username => {
      if (!username || username === '') {
        return;
      }

      const result = await this.sharedService.slotUser(this.sharedService.shareData.tid, this.sharedService.shareData.matchid, this.sharedService.shareData.adminUuid ? this.sharedService.shareData.adminUuid : this.sharedService.shareData.publicUuid, this.sharedService.shareData.reservation, this.slot.uuid, username);
      if (!result) {
        const heading = await this.translateService.get('events.notification.error.heading').toPromise();
        const body = await this.translateService.get('events.notification.error.body').toPromise();
        this.notificationsService.error(heading, body);
      } else {

        this.slot.user = {
          groupTitle: '',
          groups: [],
          'icon:bgColor': this.sharedService.shareData.adminUuid ? this.sharedService.foreignSlotColor : this.sharedService.ownSlotColor,
          'icon:text': this.sharedService.shareData.reservation,
          picture: '',
          uid: -1,
          username: username,
          userslug: username
        };

        // Unslot the user from his old slot in case he is not an admin
        if (!this.sharedService.shareData.adminUuid) {
          if (this.sharedService.currentSelectedSlot) {
            this.sharedService.deleteSlotUser(this.sharedService.shareData.tid, this.sharedService.shareData.matchid, this.sharedService.shareData.publicUuid, this.sharedService.shareData.reservation, this.sharedService.currentSelectedSlot.uuid, this.sharedService.currentSelectedSlot.user.username);
            delete this.sharedService.currentSelectedSlot.user;
          }
          this.sharedService.currentSelectedSlot = this.slot;
        }
        const heading = await this.translateService.get('events.notification.slotted.heading').toPromise();
        const body = await this.translateService.get('events.notification.slotted.body').toPromise();
        this.notificationsService.success(heading, body);
        this.updateBackground();

        // Store slot in storage to prevent double slotting and enable coloring
        if (!this.sharedService.shareData.adminUuid) {
          this.sharedService.setMatchStorage(this.sharedService.shareData.tid, this.sharedService.shareData.matchid, this.slot.uuid);
        }
      }
    });
  }

  /**
   * Called when slotlist is normal event
   * @returns {Promise<void>}
   */
  private async slotUserInternal(): Promise<void> {
    console.log('slot');
    if (this.reservation !== '' || this.slot['reserved-for']) {
      return;
    }

    if (this.slot.user) {
      const oldUsername = this.slot.user.username;
      this.slottingService.bootboxConfirm(oldUsername + ' vom Slot kicken?', result => {
        if (!result) {
          return;
        }

        SlotComponent.slottingInProgress = true;
        this.slottingService.slotUser(this.matchid, this.slot.uuid).then(slotResult => {
          SlotComponent.slottingInProgress = false;
          if (slotResult) {
            this.slottingService.showNodebbAlert('Eingeslottet', oldUsername + 'vom Slot gekickt und eingeslottet');
          } else {
            this.slottingService.showNodebbAlert('Fehler', '');
          }
        });
      });
      return;
    }

    SlotComponent.slottingInProgress = true;
    this.slottingService.slotUser(this.matchid, this.slot.uuid).then(result => {
      SlotComponent.slottingInProgress = false;
      if (result) {
        this.slottingService.showNodebbAlert('Eingeslottet', '');
      } else {
        this.slottingService.showNodebbAlert('Fehler', '');
      }
    });
  }

  /**
   * Called when a user clicks on a slot that has a user
   */
  public async deleteUser(): Promise<void> {
    if (this.sharedService.shareData) {
      await this.deleteUserShared();
    } else {
      await this.deleteUserInternal();
    }
  }

  /**
   * Called when slotlist is shared event
   * @returns {Promise<void>}
   */
  private async deleteUserShared(): Promise<void> {
    const result = await this.sharedService.deleteSlotUser(this.sharedService.shareData.tid, this.sharedService.shareData.matchid, this.sharedService.shareData.adminUuid ? this.sharedService.shareData.adminUuid : this.sharedService.shareData.publicUuid, this.sharedService.shareData.reservation, this.slot.uuid, this.slot.user.username);
    if (result) {
      if (this.sharedService.shareData.adminUuid) {
        const heading = await this.translateService.get('events.notification.unslotted.heading').toPromise();
        const body = await this.translateService.get('events.notification.unslotted.body').toPromise();
        this.notificationsService.success(heading, body);
      } else {
        const heading = await this.translateService.get('events.notification.unslotted-self.heading').toPromise();
        const body = await this.translateService.get('events.notification.unslotted-self.body').toPromise();
        this.notificationsService.success(heading, body);
        this.sharedService.currentSelectedSlot = null;
      }
      delete this.slot.user;
      this.updateBackground();
    } else {
      const heading = await this.translateService.get('events.notification.unslotted-error.heading').toPromise();
      const body = await this.translateService.get('events.notification.unslotted-error.body').toPromise();
      this.notificationsService.error(heading, body);
    }
  }

  /**
   * Called when slotlist is normal event
   * @returns {Promise<void>}
   */
  private async deleteUserInternal(): Promise<void> {
    if (this.slot['reserved-for'] || this.reservation !== '') {
      return;
    }

    SlotComponent.slottingInProgress = true;
    console.log('unslot');
    this.slottingService.unslotUser(this.matchid, this.slot.uuid).then(result => {
      SlotComponent.slottingInProgress = false;
      if (result) {
        this.slottingService.showNodebbAlert('Ausgeslottet', '');
      } else {
        // this.slottingService.showNodebbAlert('Fehler', '');
      }
    });
  }
}
