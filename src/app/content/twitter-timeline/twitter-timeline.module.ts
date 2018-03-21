import { NgModule } from '@angular/core';
import { TwitterTimelineComponent } from './twitter-timeline.component';
import { TwitterTimelineService } from './twitter-timeline.service';

@NgModule({
  declarations: [
    TwitterTimelineComponent
  ],
  exports: [
    TwitterTimelineComponent
  ],
  providers: [
    TwitterTimelineService
  ]
})
export class TwitterTimelineModule {}
