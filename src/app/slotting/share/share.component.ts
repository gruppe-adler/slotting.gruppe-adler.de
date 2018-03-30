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
      'Dies macht den aktuellen Link ungültig, behält jedoch alle geslotteten Nutzer.', result => {
      console.log('delete');
    });
  }
}
