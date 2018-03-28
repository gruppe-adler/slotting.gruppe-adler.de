import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { SlottingService } from './slotting.service';
import { SlottingComponent } from './slotting.component';
import { NodeModule } from './node.module';
import { SlottingResolver } from './slotting.resolver';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [
    SlottingComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NodeModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: OverviewComponent,
        resolve: {
          data: SlottingResolver
        }
      },
      {
        path: 'edit',
        loadChildren: './edit/edit.module#EditModule'
      }
    ])
  ],
  providers: [
    SlottingService,
    SlottingResolver
  ]
})
export class SlottingModule {

}
