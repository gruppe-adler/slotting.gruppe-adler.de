import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { SlottingService } from './slotting.service';
import { SlottingComponent } from './slotting.component';
import { NodeModule } from './node.module';
import { SlottingResolver } from './slotting.resolver';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms';
import { CanEditGuard } from './can-edit.guard';

@NgModule({
  declarations: [
    SlottingComponent,
    EditComponent
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
        component: SlottingComponent,
        resolve: {
          data: SlottingResolver
        }
      },
      {
        path: 'edit',
        component: EditComponent,
        canActivate: [CanEditGuard],
        resolve: {
          data: SlottingResolver
        }
      }
    ])
  ],
  providers: [
    SlottingService,
    SlottingResolver,
    CanEditGuard
  ]
})
export class SlottingModule {

}
