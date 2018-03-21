import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { GithubBadgeComponent } from './github-badge.component';
import { GithubBadgeService } from './github-badge.service';
import { OcticonDirective } from './octicon.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GithubBadgeComponent,
    OcticonDirective
  ],
  providers: [
    GithubBadgeService
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule.forChild()
  ],
  exports: [
    GithubBadgeComponent
  ]
})
export class GithubBadgeModule {}
