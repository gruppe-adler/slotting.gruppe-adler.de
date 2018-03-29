import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareService } from './share.service';
import { ShareComponent } from './share.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { ShareResolver } from './share.resolver';

@NgModule({
  declarations: [
    ShareComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: ShareComponent,
        resolve: {
          data: ShareResolver
        }
      }
    ])
  ],
  providers: [
    ShareService,
    ShareResolver
  ]
})
export class ShareModule {}
