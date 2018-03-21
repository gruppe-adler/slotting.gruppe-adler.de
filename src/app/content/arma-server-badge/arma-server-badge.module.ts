import { NgModule } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { ArmaServerBadgeService } from './arma-server-badge.service';
import { ArmaServerBadgeComponent } from './arma-server-badge.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ArmaServerBadgeComponent
  ],
  providers: [
    ArmaServerBadgeService
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule.forChild()
  ],
  exports: [
    ArmaServerBadgeComponent
  ]
})
export class ArmaServerBadgeModule {}
