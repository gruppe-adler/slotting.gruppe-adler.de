import { Component, Input, OnInit } from '@angular/core';
import { GithubBadgeService } from './github-badge.service';

@Component({
  templateUrl: './github-badge.component.html',
  styleUrls: ['./github-badge.component.scss'],
  selector: 'app-github-badge'
})
export class GithubBadgeComponent implements OnInit {
  @Input() organization = '';
  public data: any;

  constructor(private githubBadgeService: GithubBadgeService) {}

  ngOnInit(): void {
    this.githubBadgeService.getOrganizationData(this.organization).then(data => this.data = data);
  }
}
