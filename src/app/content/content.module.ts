import { NgModule } from '@angular/core';
import { HomeComponent } from './sites/home.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './sites/about.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { PostComponent } from './post.component';
import { TwitterTimelineModule } from './twitter-timeline/twitter-timeline.module';
import { ImprintComponent } from './sites/imprint.component';
import { ServerComponent } from './sites/server.component';
import { JoinInComponent } from './sites/join-in.component';
import { MediaComponent } from './sites/media.component';
import { NotFoundComponent } from '../main/not-found.component';
import { TeamspeakViewerModule } from './ts-viewer/teamspeak-viewer.module';
import { LightboxComponent } from './lightbox.component';
import { GithubBadgeService } from './github-badge/github-badge.service';
import { GithubBadgeModule } from './github-badge/github-badge.module';
import { ArmaServerBadgeModule } from './arma-server-badge/arma-server-badge.module';

@NgModule({
  declarations: [
    HomeComponent,
    AboutComponent,
    PostComponent,
    ImprintComponent,
    ServerComponent,
    JoinInComponent,
    MediaComponent,
    SafeHtmlPipe,
    LightboxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    TwitterTimelineModule,
    TeamspeakViewerModule,
    GithubBadgeModule,
    ArmaServerBadgeModule,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
      },
      {
        path: 'ueber-uns',
        component: AboutComponent
      },
      {
        path: 'server',
        component: ServerComponent
      },
      {
        path: 'mitspielen',
        component: JoinInComponent
      },
      {
        path: 'medien',
        component: MediaComponent
      },
      {
        path: 'impressum',
        component: ImprintComponent
      }
    ])
  ],
  entryComponents: [
    LightboxComponent
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ContentModule {}
