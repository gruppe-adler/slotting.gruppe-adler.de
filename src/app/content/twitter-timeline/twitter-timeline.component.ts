import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { TwitterTimelineService } from './twitter-timeline.service';

@Component({
  template: '',
  selector: 'app-twitter-timeline'
})
export class TwitterTimelineComponent implements AfterViewInit {
  @Input() dataSrc: any;
  @Input() opts: any;

  constructor(private element: ElementRef, private twitterTimelineService: TwitterTimelineService) {}

  public ngAfterViewInit(): void {
    this.twitterTimelineService.loadScript().subscribe(twttr => {
        const nativeElement = this.element.nativeElement;

        window['twttr'].widgets.createTimeline(this.dataSrc, nativeElement, this.opts).then
        (
          function success(embed)
          {
            // console.log('Created tweet widget: ', embed);
          }
        ).catch
        (
          function creationError(message)
          {
            // console.log('Could not create widget: ', message);
          }
        );
      },

      err => {
        console.error('Error loading twitter widget', err);
      }
    );
  }
}
