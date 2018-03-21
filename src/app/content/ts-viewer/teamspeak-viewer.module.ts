import { NgModule } from '@angular/core';
import { TeamspeakViewerComponent } from './teamspeak-viewer.component';
import { TeamspeakViewerService } from './teamspeak-viewer.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../safe-html.pipe';

@NgModule({
  declarations: [
    TeamspeakViewerComponent
  ],
  providers: [
    TeamspeakViewerService
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TeamspeakViewerComponent
  ]
})
export class TeamspeakViewerModule {}
