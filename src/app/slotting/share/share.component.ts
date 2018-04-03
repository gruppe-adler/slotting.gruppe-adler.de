import { Component, OnInit } from '@angular/core';
import { ShareService } from './share.service';
import { ActivatedRoute } from '@angular/router';
import { SlottingService } from '../slotting.service';

@Component({
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  public shareData: any;

  constructor(public route: ActivatedRoute, private shareService: ShareService, private slottingService: SlottingService) {}

  public ngOnInit(): void {
    this.shareData = this.route.snapshot.data.data;
    console.log(this.shareData);
  }

  public delete(share: any): void {
    this.slottingService.bootboxConfirm(
      'Möchtest du den Slottinglink für ' + share.reservation + ' wirklich löschen? ' +
      'Dies macht den aktuellen Link ungültig, behält jedoch alle geslotteten Nutzer.', async result => {
        if (result) {
          const deleteResult = await this.shareService.deleteShare(this.shareData.tid, this.shareData.matchid, share.reservation);
          console.log(deleteResult);
          if (deleteResult) {
            const index = this.shareData.activeReservations.indexOf(share);
            if (index > -1) {
              this.shareData.activeReservations.splice(index, 1);
            }
            this.shareData.availableReservations.push(share.reservation);
          }
        }
    });
  }

  public async add(share: any): Promise<void> {
    const result = await this.shareService.addShare(this.shareData.tid, this.shareData.matchid, share);
    if (result) {
      const index = this.shareData.availableReservations.indexOf(share);
      if (index > -1) {
        this.shareData.availableReservations.splice(index, 1);
      }
      this.shareData.activeReservations.push(result);
    }
  }
}
