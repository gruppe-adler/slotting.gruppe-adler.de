import { Component, Input, OnInit } from '@angular/core';
import { TeamspeakViewerService } from './teamspeak-viewer.service';

@Component({
  template: '<mat-spinner *ngIf="!innerHtml"></mat-spinner><div [id]="divId" *ngIf="divId" class="content" [innerHtml]="innerHtml"></div>',
  styleUrls: ['./teamspeak-viewer.component.scss'],
  selector: 'app-teamspeak-viewer'
})
export class TeamspeakViewerComponent implements OnInit {
  @Input() serverId: number;

  public divId: string;
  public innerHtml = '';

  constructor(private teamspeakViewerService: TeamspeakViewerService) {
  }

  ngOnInit(): void {
    this.divId = `tsviewer_${this.serverId}`;

    this.teamspeakViewerService.getTeamspeakData(this.serverId).subscribe(data => {
      console.log(data);
      this.innerHtml = data.html;

      window.setTimeout(() => {
        // Remove google play store element
        const contentDiv = document.getElementById(this.divId).lastChild;
        contentDiv.removeChild(contentDiv.lastChild);

        try {
          // Add own client badge
          const serverInfo = document.getElementsByClassName('tsv_serverinfo')[0].lastChild;
          console.log(serverInfo);

          const clientBadge = document.createElement('span');
          clientBadge.textContent = `Clients: ${data.virtualserver_realclientsonline} / ${data.virtualserver_maxclients}`;
          serverInfo.appendChild(clientBadge);
        } catch (e) {
          console.log(e);
        }

        try {
          // Modify server badge
          const serverElement = document.getElementsByClassName('tsv_server')[0].lastChild;
          console.log(serverElement);

          const serverNameBadge = document.createElement('a');
          serverNameBadge.textContent = 'Gruppe Adler';
          serverNameBadge.href = `ts3server://${data.net_ip}?port=${data.net_udp_port}`;
          serverNameBadge.classList.add('tsv_viewer_server_name');
          serverElement.appendChild(serverNameBadge);
        } catch (e) {
          console.log(e);
        }
      }, 200);
    });
  }
}
